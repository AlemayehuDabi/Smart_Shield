import { useState } from 'react';
import { View } from 'react-native';

import { ScreenShell } from '@/src/components/ui/ScreenShell';
import { ShellHeader } from '@/src/components/shell/ShellHeader';
import { Segmented } from '@/src/components/ui/Segmented';
import { Badge } from '@/src/components/ui/Badge';
import { ControlPanel } from '@/src/components/automation/ControlPanel';
import { StrategyBuilder } from '@/src/components/automation/StrategyBuilder';
import { BacktestView } from '@/src/components/automation/BacktestView';
import { BrokerConnect } from '@/src/components/automation/BrokerConnect';
import { seedStrategies, type Strategy } from '@/src/data/automation';

type Tab = 'control' | 'build' | 'backtest';

export default function AutomationScreen() {
  const [tab, setTab] = useState<Tab>('control');
  const [list, setList] = useState<Strategy[]>(seedStrategies);
  const [killed, setKilled] = useState(false);
  const [brokerConnected, setBrokerConnected] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);

  function toggle(id: string) {
    setList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'live' ? 'paused' : s.status === 'paused' ? 'live' : s.status }
          : s,
      ),
    );
  }

  return (
    <ScreenShell>
      <ShellHeader
        eyebrow="Pillar 04 · Automation"
        title="Automation"
        subtitle="Automate the strategies you've mastered — inside guardrails, with a kill switch that always wins."
        right={<Badge tone="warn">Elite</Badge>}
      />

      <View className="mb-4">
        <Segmented
          fill
          options={[
            { value: 'control', label: 'Control' },
            { value: 'build', label: 'Build' },
            { value: 'backtest', label: 'Backtest' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      {tab === 'control' ? (
        <ControlPanel
          strategies={list}
          killed={killed}
          onToggle={toggle}
          onToggleKill={() => setKilled((k) => !k)}
          brokerConnected={brokerConnected}
          onOpenBroker={() => setBrokerOpen(true)}
        />
      ) : null}
      {tab === 'build' ? <StrategyBuilder onRunBacktest={() => setTab('backtest')} /> : null}
      {tab === 'backtest' ? <BacktestView onEdit={() => setTab('build')} /> : null}

      <BrokerConnect open={brokerOpen} onClose={() => setBrokerOpen(false)} onConnected={() => setBrokerConnected(true)} />
    </ScreenShell>
  );
}
