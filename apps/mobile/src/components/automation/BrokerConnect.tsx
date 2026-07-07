import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { brokers, type Broker } from '@/src/data/automation';
import { palette } from '@/src/theme/palette';
import { useAppTheme } from '@/src/theme/use-shield-theme';

type Step = 'choose' | 'auth' | 'scope' | 'done';

export function BrokerConnect({
  open,
  onClose,
  onConnected,
}: {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
}) {
  const th = useAppTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('choose');
  const [broker, setBroker] = useState<Broker>(brokers[0]);
  const [scope, setScope] = useState<'read' | 'trade'>('trade');
  const [authing, setAuthing] = useState(false);

  const titles: Record<Step, string> = {
    choose: 'Connect a broker',
    auth: `Authorize ${broker.name}`,
    scope: 'Set permissions',
    done: 'Broker connected',
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep('choose');
      setAuthing(false);
    }, 200);
  };

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
      <View className="flex-1 justify-end bg-black/55">
        <View className={`max-h-[88%] rounded-t-3xl border-t ${th.borderDefault} ${th.dark ? 'bg-canvas-elevated' : 'bg-white'}`}>
          <View className={`flex-row items-center justify-between border-b px-5 py-4 ${th.hairline}`}>
            <Text className={`font-sans-bold text-title ${th.textTitle}`}>{titles[step]}</Text>
            <Pressable onPress={close} className={`h-8 w-8 items-center justify-center rounded-full ${th.surfaceElevated}`}>
              <Ionicons name="close" size={18} color={th.dark ? palette.inkMuted : '#475569'} />
            </Pressable>
          </View>

          <ScrollView className="px-5 py-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
            {step !== 'done' ? (
              <View className="mb-5 flex-row items-center gap-2">
                {(['choose', 'auth', 'scope'] as Step[]).map((s, i) => {
                  const order: Step[] = ['choose', 'auth', 'scope'];
                  const active = order.indexOf(step) >= i;
                  return (
                    <View key={s} className="flex-1 flex-row items-center gap-2">
                      <View className={`h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-mint' : th.surfaceElevated}`}>
                        <Text className={`font-mono text-2xs ${active ? 'text-canvas' : th.textFaint}`}>{i + 1}</Text>
                      </View>
                      {i < 2 ? <View className={`h-px flex-1 ${order.indexOf(step) > i ? 'bg-mint' : th.hairline}`} /> : null}
                    </View>
                  );
                })}
              </View>
            ) : null}

            {step === 'choose' ? (
              <View className="flex-row flex-wrap gap-2.5">
                {brokers.map((b) => (
                  <ScalePressable
                    key={b.id}
                    onPress={() => {
                      setBroker(b);
                      setStep('auth');
                    }}
                    className={`w-[47%] flex-row items-center gap-3 rounded-2xl border p-3.5 ${th.borderDefault} ${th.surfaceCard}`}
                  >
                    <View className={`h-9 w-9 items-center justify-center rounded-lg ${th.surfaceElevated}`}>
                      <Text className={`font-sans-bold text-caption ${th.textTitle}`}>{b.glyph}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className={`font-sans-bold text-2xs ${th.textTitle}`} numberOfLines={1}>{b.name}</Text>
                      <Text className={`font-mono text-[9px] ${th.textFaint}`}>{b.kind}</Text>
                    </View>
                  </ScalePressable>
                ))}
              </View>
            ) : null}

            {step === 'auth' ? (
              <View className="items-center">
                <View className={`h-14 w-14 items-center justify-center rounded-2xl ${th.surfaceElevated}`}>
                  <Text className={`font-sans-bold text-title ${th.textTitle}`}>{broker.glyph}</Text>
                </View>
                <Text className={`mt-4 font-sans-bold text-body ${th.textTitle}`}>Sign in to {broker.name}</Text>
                <Text className={`mt-1.5 text-center font-sans text-2xs leading-[18px] ${th.textMuted}`}>
                  In production this opens {broker.name}&rsquo;s secure OAuth page. Smart Shield never sees your password.
                </Text>
                <View className={`mt-5 w-full gap-2 rounded-2xl border p-4 ${th.borderDefault} ${th.surfaceCard}`}>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="lock-closed" size={13} color={palette.mint} />
                    <Text className={`font-sans text-2xs ${th.textBody}`}>Bank-grade encryption</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="shield-checkmark-outline" size={13} color={palette.mint} />
                    <Text className={`font-sans text-2xs ${th.textBody}`}>Revoke access anytime</Text>
                  </View>
                </View>
                <ScalePressable
                  onPress={() => {
                    setAuthing(true);
                    setTimeout(() => setStep('scope'), 900);
                  }}
                  className={`mt-5 w-full flex-row items-center justify-center gap-2 rounded-[14px] py-3.5 ${authing ? th.surfaceElevated : 'bg-mint'}`}
                >
                  <Text className={`font-sans-bold text-caption ${authing ? th.textMuted : 'text-canvas'}`}>
                    {authing ? 'Authorizing…' : `Continue to ${broker.name}`}
                  </Text>
                </ScalePressable>
              </View>
            ) : null}

            {step === 'scope' ? (
              <View className="gap-3">
                {[
                  { id: 'read' as const, title: 'Read-only', desc: 'Sync positions & balances for analytics. No orders.' },
                  { id: 'trade' as const, title: 'Trade on my behalf', desc: 'Mastered strategies place orders, bound by guardrails & kill switch.' },
                ].map((opt) => (
                  <ScalePressable
                    key={opt.id}
                    onPress={() => setScope(opt.id)}
                    className={`flex-row items-start gap-3 rounded-2xl border p-4 ${scope === opt.id ? 'border-mint bg-mint/10' : `${th.borderDefault} ${th.surfaceCard}`}`}
                  >
                    <View className={`mt-0.5 h-5 w-5 items-center justify-center rounded-full border ${scope === opt.id ? 'border-mint bg-mint' : th.borderDefault}`}>
                      {scope === opt.id ? <Ionicons name="checkmark" size={12} color={palette.canvas} /> : null}
                    </View>
                    <View className="flex-1">
                      <Text className={`font-sans-bold text-caption ${th.textTitle}`}>{opt.title}</Text>
                      <Text className={`mt-0.5 font-sans text-2xs leading-[17px] ${th.textMuted}`}>{opt.desc}</Text>
                    </View>
                  </ScalePressable>
                ))}
                <ScalePressable onPress={() => setStep('done')} className="mt-1 items-center rounded-[14px] bg-mint py-3.5">
                  <Text className="font-sans-bold text-caption text-canvas">Grant access</Text>
                </ScalePressable>
              </View>
            ) : null}

            {step === 'done' ? (
              <View className="items-center py-4">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-mint/15">
                  <Ionicons name="checkmark" size={28} color={palette.mint} />
                </View>
                <Text className={`mt-4 font-sans-bold text-title ${th.textTitle}`}>{broker.name} connected</Text>
                <Text className={`mt-1.5 text-center font-sans text-2xs leading-[18px] ${th.textMuted}`}>
                  {scope === 'trade'
                    ? 'Mastered strategies can now place orders within your guardrails. The kill switch halts everything instantly.'
                    : 'Positions will sync for analytics. Automations remain read-only.'}
                </Text>
                <ScalePressable
                  onPress={() => {
                    onConnected();
                    close();
                  }}
                  className="mt-5 w-full items-center rounded-[14px] bg-mint py-3.5"
                >
                  <Text className="font-sans-bold text-caption text-canvas">Done</Text>
                </ScalePressable>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
