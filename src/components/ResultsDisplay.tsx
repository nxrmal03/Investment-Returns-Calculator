"use client";

import { formatINR } from "@/lib/format";

export function ResultsDisplay({
  totalInvested,
  estimatedReturns,
  totalValue,
}: {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
}) {
  const positiveReturns = Math.max(0, estimatedReturns);

  return (
    <section className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur transition dark:border-white/10 dark:bg-zinc-950/50 sm:p-6">
      <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Results
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        A quick summary of invested amount, returns, and total value.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total invested"
          value={formatINR(totalInvested)}
          tone="neutral"
        />
        <StatCard
          label="Estimated returns"
          value={formatINR(positiveReturns)}
          tone="positive"
        />
        <StatCard
          label="Total value"
          value={formatINR(totalValue)}
          tone="strong"
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "positive" | "strong";
}) {
  const toneClass =
    tone === "positive"
      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
      : tone === "strong"
        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
        : "bg-zinc-50 text-zinc-950 dark:bg-white/5 dark:text-zinc-100";

  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-950/30">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div
        className={[
          "mt-3 inline-flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold tabular-nums transition",
          toneClass,
        ].join(" ")}
      >
        <span>{value}</span>
        <span className="opacity-70">INR</span>
      </div>
    </div>
  );
}

