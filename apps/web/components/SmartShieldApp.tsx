"use client";

import { useMemo, useState } from "react";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { NotificationPanel } from "@/components/alerts/NotificationPanel";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { ModulesView } from "@/components/modules/ModulesView";
import type { AppView } from "@/components/shell/RailNav";
import { NavDrawer } from "@/components/shell/NavDrawer";
import { RailNav } from "@/components/shell/RailNav";
import { TopStrip } from "@/components/shell/TopStrip";
import { SettingsView } from "@/components/settings/SettingsView";
import { ThreatsView } from "@/components/threats/ThreatsView";
import {
  alerts as initialAlerts,
  chartSeries,
  initialMessages,
  insightSummary,
  metrics,
  modules,
  patternHighlights,
  systemState,
  threats,
  timeline,
} from "@/lib/mock-data";

export function SmartShieldApp() {
  const [view, setView] = useState<AppView>("overview");
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);

  const unreadCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);

  const markRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
      <aside className="hidden shrink-0 border-b border-[var(--ss-border)] bg-[var(--ss-bg)]/90 backdrop-blur-xl md:block md:w-[72px] md:border-b-0 md:border-r">
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
          systemState={systemState}
          alertCount={unreadCount}
          onOpenAlerts={() => setAlertsOpen(true)}
          assistantOpen={assistantOpen}
          onToggleAssistant={() => setAssistantOpen((v) => !v)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row lg:items-stretch">
          <main className="ss-scroll min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            {view === "overview" && (
              <DashboardHome
                systemState={systemState}
                metrics={metrics}
                insightSummary={insightSummary}
                timeline={timeline}
                riskSeries={chartSeries.risk}
                activitySeries={chartSeries.activity}
                chartLabels={chartSeries.labels}
              />
            )}
            {view === "threats" && <ThreatsView threats={threats} />}
            {view === "analytics" && (
              <AnalyticsView
                riskSeries={chartSeries.risk}
                activitySeries={chartSeries.activity}
                labels={chartSeries.labels}
                patternHighlights={patternHighlights}
              />
            )}
            {view === "modules" && <ModulesView modules={modules} />}
            {view === "settings" && <SettingsView />}
          </main>

          {assistantOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
                aria-label="Close assistant"
                onClick={() => setAssistantOpen(false)}
              />
              <div
                className="flex max-h-[100dvh] w-full max-w-[400px] flex-col border-l border-[var(--ss-border)] bg-[var(--ss-bg)] shadow-2xl max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-30 lg:relative lg:z-auto lg:h-full lg:min-h-0 lg:w-[380px] lg:max-w-[380px] lg:shrink-0 lg:shadow-none"
              >
                <AssistantPanel open={assistantOpen} initialMessages={initialMessages} />
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
