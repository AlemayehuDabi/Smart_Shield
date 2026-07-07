// Command server is the composition root for the Smart Shield API gateway.
// It is the ONE place that constructs concrete implementations and wires them
// together — every dependency is passed explicitly via constructors (no globals,
// no init magic). To split a module into its own service later, you lift its
// wiring block out of here.
package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	gql "github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/dataloader"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/resolver"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/config"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/logger"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/postgres"
	redisplatform "github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/redis"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/security"
	portpg "github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/repository/postgres"
	portuc "github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/usecase"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/repository/billing"
	userpg "github.com/AlemayehuDabi/smart-shield/services/api/internal/user/repository/postgres"
	useruc "github.com/AlemayehuDabi/smart-shield/services/api/internal/user/usecase"
)

func main() {
	if err := run(); err != nil {
		// Startup failed before the logger exists in some cases; stderr is fine.
		panic(err)
	}
}

func run() error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	log, err := logger.New(cfg.Env, cfg.LogLevel)
	if err != nil {
		return err
	}
	defer func() { _ = log.Sync() }()

	ctx := context.Background()

	// --- shared infrastructure (built once, injected everywhere) --------------
	pool, err := postgres.NewPool(ctx, cfg.Postgres)
	if err != nil {
		return err
	}
	defer pool.Close()

	rdb, err := redisplatform.New(ctx, cfg.Redis)
	if err != nil {
		return err
	}
	defer func() { _ = rdb.Close() }()
	_ = rdb // reserved for the caching layer

	tokenManager := security.NewTokenManager(cfg.Auth.JWTSecret, cfg.Auth.AccessTokenTTL, cfg.Auth.RefreshTokenTTL)
	hasher := security.BcryptHasher{}

	// --- user & auth module ---------------------------------------------------
	userRepo := userpg.NewUserRepo(pool)
	refreshRepo := userpg.NewRefreshTokenRepo(pool)
	billingProvider := billing.NewStripeStub()

	authSvc := useruc.NewAuthService(userRepo, refreshRepo, hasher, tokenManager)
	profileSvc := useruc.NewProfileService(userRepo)
	subscriptionSvc := useruc.NewSubscriptionService(userRepo, billingProvider)

	// --- portfolio & trade-journal module -------------------------------------
	tradeRepo := portpg.NewTradeRepo(pool)
	tradeSvc := portuc.NewTradeService(tradeRepo)
	analyticsSvc := portuc.NewAnalyticsService(tradeRepo)

	// --- GraphQL wiring -------------------------------------------------------
	res := &resolver.Resolver{
		Auth:         authSvc,
		Users:        profileSvc,
		Subscription: subscriptionSvc,
		Trades:       tradeSvc,
		Analytics:    analyticsSvc,
	}
	gqlHandler := gql.NewServer(res, log)
	// Dataloaders are per-request state, so they wrap the handler (not global).
	gqlWithLoaders := dataloader.Middleware(profileSvc)(gqlHandler)

	// --- HTTP server ----------------------------------------------------------
	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(corsMiddleware(cfg.CORS.AllowedOrigins))
	r.Use(gql.RequestID())
	r.Use(gql.Auth(tokenManager)) // optional auth: sets identity when a valid token is present
	r.Use(gql.Logging(log))

	r.GET("/healthz", func(c *gin.Context) { c.String(http.StatusOK, "ok") })
	r.GET("/", gin.WrapH(playground.Handler("Smart Shield GraphQL", "/graphql")))
	r.Any("/graphql", gin.WrapH(gqlWithLoaders))

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Info("server listening", zap.String("port", cfg.Port), zap.String("env", cfg.Env))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatal("http server error", zap.Error(err))
		}
	}()

	// Graceful shutdown on SIGINT/SIGTERM.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Info("shutting down")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return srv.Shutdown(shutdownCtx)
}

// corsMiddleware builds a CORS handler. "*" cannot be combined with credentials,
// so allow-all disables credentialed requests (dev only); explicit origins enable them.
func corsMiddleware(origins []string) gin.HandlerFunc {
	c := cors.Config{
		AllowMethods:  []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders:  []string{"Origin", "Content-Type", "Authorization", "X-Request-ID"},
		ExposeHeaders: []string{"Content-Length", "X-Request-ID"},
		MaxAge:        12 * time.Hour,
	}
	if len(origins) == 1 && origins[0] == "*" {
		c.AllowAllOrigins = true
	} else {
		c.AllowOrigins = origins
		c.AllowCredentials = true
	}
	return cors.New(c)
}
