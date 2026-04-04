import type { NextConfig } from "next";

const internalGraphql =
  process.env.GRAPHQL_INTERNAL_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: `${internalGraphql}/graphql`,
      },
    ];
  },
};

export default nextConfig;
