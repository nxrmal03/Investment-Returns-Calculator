"use client";

import { formatINR } from "@/lib/format";
import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Slice = { name: string; value: number; color: string };

export function ReturnsPieChart({
  invested,
  returns,
}: {
  invested: number;
  returns: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const safeInvested = Math.max(0, invested);
  const safeReturns = Math.max(0, returns);

  const data: Slice[] = [
    { name: "Invested", value: safeInvested, color: "#0ea5e9" }, // sky-500
    { name: "Returns", value: safeReturns, color: "#22c55e" }, // green-500
  ];

  const hasAny = data.some((d) => d.value > 0);

  return (
    <section className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur transition dark:border-white/10 dark:bg-zinc-950/50 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Breakdown
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Invested amount vs returns earned.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <LegendDot color="#0ea5e9" label="Invested" />
          <LegendDot color="#22c55e" label="Returns" />
        </div>
      </div>

      <div className="mt-6 h-56 sm:h-64">
        {hasAny && mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="88%"
                paddingAngle={2}
                stroke="rgba(255,255,255,0.10)"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white/40 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-950/20 dark:text-zinc-400">
            {hasAny ? "Loading chart…" : "Enter values to see the chart."}
          </div>
        )}
      </div>
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="font-medium">{label}</span>
    </div>
  );
}

type TooltipLike = {
  active?: boolean;
  payload?: Array<{ payload?: { name?: string; value?: number } }>;
};

function CustomTooltip(props: TooltipLike) {
  const payload = props.payload?.[0]?.payload as
    | { name: string; value: number }
    | undefined;

  if (!props.active || !payload) return null;

  return (
    <div className="rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-950/80">
      <div className="font-medium text-zinc-950 dark:text-zinc-100">
        {payload.name}
      </div>
      <div className="mt-1 tabular-nums text-zinc-600 dark:text-zinc-300">
        {formatINR(payload.value)}
      </div>
    </div>
  );
}

