import { useQuery } from '@tanstack/react-query';

import { watchlist } from '@/src/lib/mock-data';
import { useAppStore } from '@/src/stores/use-app-store';

function parseLast(last: string): number {
  const n = parseFloat(last.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function useLiveQuote() {
  const symbol = useAppStore((s) => s.selectedSymbol);
  const row = watchlist.find((w) => w.symbol === symbol) ?? watchlist[0];
  const base = parseLast(row.last);

  const q = useQuery({
    queryKey: ['quote', symbol],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120));
      const jitter = base * (Math.sin(Date.now() / 4000) * 0.00015 + (Math.cos(Date.now() / 7000) * 0.00008));
      return {
        symbol,
        price: base + jitter,
        chgPct: row.chgPct + Math.sin(Date.now() / 9000) * 0.04,
        vol: row.vol,
        name: row.name,
      };
    },
    refetchInterval: 1500,
    staleTime: 0,
  });

  return {
    ...q,
    displayPrice: q.data?.price ?? base,
    formatted:
      q.data != null
        ? q.data.price >= 1000
          ? q.data.price.toLocaleString('en-US', { maximumFractionDigits: 2 })
          : q.data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
        : row.last,
    chgPct: q.data?.chgPct ?? row.chgPct,
    vol: q.data?.vol ?? row.vol,
    name: q.data?.name ?? row.name,
  };
}
