'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { apiGet, formatCoins, type CardHistory } from '@/lib/market-client';

interface CardPriceChartProps {
  cardId: string;
  onClose: () => void;
}

const chartConfig = {
  price: { label: 'Prix', color: '#f0abfc' },
} satisfies ChartConfig;

/** Graphique du cours d'une carte : points de prix + statistiques. */
export default function CardPriceChart({ cardId, onClose }: CardPriceChartProps) {
  const [history, setHistory] = useState<CardHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiGet<{ history: CardHistory }>(
          `/api/market/cards/${encodeURIComponent(cardId)}/history`,
        );
        if (alive) setHistory(res.history);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [cardId]);

  const points = history?.points ?? [];
  const stats = history?.stats;

  return (
    <div className="w-full max-w-lg px-2 sm:px-0">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-base font-bold text-white truncate sm:text-lg">
          Cours · {history?.card_name ?? cardId}
        </h3>
        <button
          onClick={onClose}
          className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          Fermer
        </button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Dernier prix" value={stats.last_price} suffix="🪙" accent />
          <Stat label="Moy. 7 j" value={stats.avg_7d} suffix="🪙" />
          <Stat label="Ventes" value={stats.total_sales} />
          <Stat label="Enchère min." value={stats.lowest_active} suffix="🪙" />
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 sm:p-3">
        {loading ? (
          <div className="flex h-48 sm:h-56 items-center justify-center text-sm text-white/40">
            Chargement…
          </div>
        ) : error ? (
          <div className="flex h-48 sm:h-56 items-center justify-center px-4 text-center text-sm text-rose-300">
            {error}
          </div>
        ) : points.length === 0 ? (
          <div className="flex h-48 sm:h-56 flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium text-white/55">Aucune vente enregistrée</p>
            <p className="text-xs text-white/35">
              Le graphique s&apos;affichera dès la première vente conclue.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-48 sm:h-56 w-full">
            <AreaChart data={points} margin={{ left: 6, right: 6, top: 4 }}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0abfc" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f0abfc" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="sold_at"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                minTickGap={20}
                tickFormatter={(v: string) =>
                  new Date(v).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
                tickFormatter={(v: number) => formatCoins(v)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="price"
                type="monotone"
                stroke="#f0abfc"
                strokeWidth={2}
                fill="url(#fillPrice)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>

      {stats && stats.active_count > 0 && (
        <p className="mt-3 text-center text-xs text-white/40">
          {stats.active_count} enchère{stats.active_count > 1 ? 's' : ''} active
          {stats.active_count > 1 ? 's' : ''} en cours pour cette carte.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${accent ? 'text-fuchsia-200' : 'text-white/85'}`}>
        {value === null || value === undefined ? '—' : formatCoins(value)}
        {suffix && value !== null && value !== undefined && (
          <span className="ml-0.5 text-[10px] text-white/50">{suffix}</span>
        )}
      </p>
    </div>
  );
}
