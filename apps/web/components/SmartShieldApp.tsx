"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { NotificationPanel } from "@/components/alerts/NotificationPanel";
import { CoachView } from "@/components/coach/CoachView";
import { SignalsView } from "@/components/feedback/SignalsView";
import { JournalView } from "@/components/journal/JournalView";
import { LabView } from "@/components/lab/LabView";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import type { AppView } from "@/components/shell/RailNav";
import { NavDrawer } from "@/components/shell/NavDrawer";
import { RailNav } from "@/components/shell/RailNav";
import { TopStrip } from "@/components/shell/TopStrip";
import { SettingsView } from "@/components/settings/SettingsView";
import { TerminalView } from "@/components/trading/TerminalView";
import {
  allocation,
  alerts as initialAlerts,
  chartSeries,
  initialMessages,
  journalEntries,
  labModules,
  learningBeats,
  metrics,
  mistakePatterns,
  patternHighlights,
  personalityAxes,
  riskMode,
  tradingSignals,
} from "@/lib/mock-data";

export function SmartShieldApp() {
  const [view, setView] = useState<AppView>("terminal");
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [paperTrading, setPaperTrading] = useState(true);

  const unreadCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);

  const markRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setMobileNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
      <aside className="hidden w-[min(100%,260px)] shrink-0 border-b border-[var(--ss-border)] bg-[var(--ss-bg)]/90 backdrop-blur-xl md:block md:border-b-0 md:border-r">
        <RailNav active={view} onChange={setView} />
      </aside>

      <NavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        active={view}
        onNavigate={setView}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <TopStrip
          riskMode={riskMode}
          paperTrading={paperTrading}
          onTogglePaper={() => setPaperTrading((p) => !p)}
          alertCount={unreadCount}
          onOpenAlerts={() => setAlertsOpen(true)}
          assistantOpen={assistantOpen}
          onToggleAssistant={() => setAssistantOpen((v) => !v)}
          mobileNavOpen={mobileNavOpen}
          onToggleMobileNav={() => setMobileNavOpen((v) => !v)}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row lg:items-stretch">
          <main className="ss-scroll min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            {view === "terminal" && <TerminalView />}
            {view === "portfolio" && <PortfolioView allocation={allocation} metrics={metrics} />}
            {view === "analytics" && (
              <AnalyticsView
                pnlSeries={chartSeries.pnl}
                tradeCountSeries={chartSeries.trades}
                labels={chartSeries.labels}
                patternHighlights={patternHighlights}
                mistakes={mistakePatterns}
              />
            )}
            {view === "coach" && <CoachView beats={learningBeats} axes={personalityAxes} />}
            {view === "journal" && <JournalView entries={journalEntries} />}
            {view === "signals" && <SignalsView signals={tradingSignals} />}
            {view === "lab" && <LabView modules={labModules} />}
            {view === "settings" && <SettingsView />}
          </main>

          {assistantOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                aria-label="Close assistant"
                onClick={() => setAssistantOpen(false)}
              />
              <div className="flex max-h-dvh w-[min(100vw,400px)] max-w-[400px] flex-col border-l border-[var(--ss-border)] bg-[var(--ss-bg)] shadow-2xl max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-[45] lg:relative lg:z-auto lg:h-full lg:min-h-0 lg:w-[380px] lg:max-w-[380px] lg:shrink-0 lg:shadow-none">
                <AssistantPanel
                  open={assistantOpen}
                  initialMessages={initialMessages}
                  onClose={() => setAssistantOpen(false)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <NotificationPanel
        open={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        items={alerts}
        onMarkRead={markRead}
      />
    </div>
  );
}
