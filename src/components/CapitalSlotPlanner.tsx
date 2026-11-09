"use client";

import { useState, useMemo } from "react";

const SLOTS = 10;

function fmtINR(n: number): string {
  if (n >= 10_000_000) return "₹" + (n / 10_000_000).toFixed(2) + " Cr";
  if (n >= 100_000)    return "₹" + (n / 100_000).toFixed(2) + " L";
  if (n >= 1_000)      return "₹" + (n / 1_000).toFixed(1) + " K";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function fmtFull(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

const QUICK_SETS = [
  { label: "1L",   value: 100_000 },
  { label: "5L",   value: 500_000 },
  { label: "10L",  value: 1_000_000 },
  { label: "25L",  value: 2_500_000 },
  { label: "50L",  value: 5_000_000 },
  { label: "1 Cr", value: 10_000_000 },
];

export function CapitalSlotPlanner() {
  const [capital, setCapital] = useState(1_000_000);
  const [raw, setRaw] = useState("1000000");
  const [riskPct, setRiskPct] = useState(10);
  const [targetPct, setTargetPct] = useState(50);

  const perSlot   = capital / SLOTS;
  const riskAmt   = perSlot * (riskPct / 100);
  const targetAmt = perSlot * (targetPct / 100);
  const maxProfit = targetAmt * SLOTS;

  const minWins = useMemo(() => {
    for (let w = 0; w <= SLOTS; w++) {
      if (w * targetAmt - (SLOTS - w) * riskAmt > 0) return w;
    }
    return SLOTS;
  }, [targetAmt, riskAmt]);

  function handleInput(val: string) {
    setRaw(val);
    const n = parseFloat(val.replace(/,/g, "")) || 0;
    setCapital(n);
  }

  const scenarios = useMemo(() =>
    Array.from({ length: SLOTS + 1 }, (_, i) => {
      const wins   = SLOTS - i;
      const losses = i;
      const profit = wins * targetAmt;
      const loss   = losses * riskAmt;
      const net    = profit - loss;
      const pct    = capital > 0 ? (net / capital) * 100 : 0;
      return { wins, losses, profit, loss, net, pct };
    }),
  [targetAmt, riskAmt, capital]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">

      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Capital Slot Planner
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          10-slot equal allocation · {riskPct}% risk per slot · {targetPct}% target per trade · R:R 1:{(targetPct / riskPct).toFixed(1)}
        </p>
      </div>

      {/* Capital input */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Total Capital
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-semibold text-zinc-400">₹</span>
              <input
                type="number"
                value={raw}
                onChange={e => handleInput(e.target.value)}
                className="w-48 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xl font-semibold text-zinc-900 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Risk %
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={riskPct}
                onChange={e => setRiskPct(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-20 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xl font-semibold text-red-500 outline-none transition focus:border-red-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-red-400"
              />
              <span className="font-mono text-xl font-semibold text-zinc-400">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Target %
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={1000}
                value={targetPct}
                onChange={e => setTargetPct(Math.max(0, Number(e.target.value)))}
                className="w-20 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xl font-semibold text-emerald-500 outline-none transition focus:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-emerald-400"
              />
              <span className="font-mono text-xl font-semibold text-zinc-400">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Quick Set
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_SETS.map(q => (
                <button
                  key={q.label}
                  onClick={() => { setCapital(q.value); setRaw(String(q.value)); }}
                  className="rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-500 transition hover:border-blue-500 hover:text-blue-500 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Capital",   value: fmtINR(capital),   color: "text-blue-500" },
          { label: "Per Slot",        value: fmtINR(perSlot),   color: "text-zinc-900 dark:text-zinc-100" },
          { label: "Max Risk / Slot", value: fmtINR(riskAmt),   color: "text-red-500" },
          { label: "Target / Slot",   value: fmtINR(targetAmt), color: "text-emerald-500" },
        ].map(t => (
          <div key={t.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">{t.label}</div>
            <div className={`mt-1 font-mono text-lg font-bold ${t.color}`}>{t.value}</div>
          </div>
        ))}
      </div>

      {/* Slots grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">10 Trade Slots</h2>
          <div className="flex gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-500" />Risk {riskPct}%</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />Target {targetPct}%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: SLOTS }, (_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-blue-400 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-500/10 px-2 py-0.5 font-mono text-xs font-bold text-blue-500">
                  S-{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-zinc-400">1/10</span>
              </div>
              <div className="mt-3 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">{fmtFull(perSlot)}</div>
              <div className="my-3 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="flex h-full gap-px">
                  <div className="h-full flex-[9] rounded-l-full bg-blue-400/40" />
                  <div className="h-full flex-[1] rounded-r-full bg-red-500" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Risk</span>
                  <span className="font-mono font-semibold text-red-500">{fmtFull(riskAmt)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Target</span>
                  <span className="font-mono font-semibold text-emerald-500">{fmtFull(targetAmt)}</span>
                </div>
              </div>
              <div className="mt-3 rounded bg-emerald-500/10 py-1 text-center font-mono text-xs font-semibold text-emerald-500">
                R:R = 1 : {(targetPct / riskPct).toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Scenario section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Profit Scenarios — All 10 Trades
          </h2>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-500">
            Best case: {fmtINR(maxProfit)}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">Total Profit if ALL 10 Win</div>
            <div className="text-xs text-zinc-400">10 × (per slot × 50% target)</div>
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-500">{fmtFull(maxProfit)}</div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <span>✦</span>
          <span>Minimum wins needed to be profitable: <strong className="text-emerald-500">{minWins} wins out of 10</strong></span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                {["Outcome", "Gross Profit", "Gross Loss", "Net P&L", "P&L %", "Return %"].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-zinc-400 first:text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarios.map(({ wins, losses, profit, loss, net, pct }) => {
                const isMinProfit = wins === minWins;
                const isAllWin   = wins === SLOTS;
                const isAllLoss  = wins === 0;
                const netColor   = net >= 0 ? "text-emerald-500" : "text-red-500";
                const barPct     = Math.min(Math.abs(pct) / 50 * 100, 100);
                const pctStr     = (net >= 0 ? "+" : "") + pct.toFixed(1) + "%";
                const rowBg      = isAllWin || isMinProfit ? "bg-emerald-500/5" : isAllLoss ? "bg-red-500/5" : "";

                return (
                  <tr key={wins} className={`border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 ${rowBg}`}>
                    <td className="px-4 py-3 text-left">
                      <span className="flex items-center gap-2">
                        <span>
                          <span className="font-bold text-emerald-500">{wins}W</span>
                          {" / "}
                          <span className="font-bold text-red-500">{losses}L</span>
                        </span>
                        {isAllWin    && <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-xs font-bold text-emerald-500">Best</span>}
                        {isMinProfit && !isAllWin && <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-xs font-bold text-emerald-500">Min Profit</span>}
                        {isAllLoss   && <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-xs font-bold text-red-500">Worst</span>}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right ${wins > 0 ? "text-emerald-500" : "text-zinc-400"}`}>
                      {wins > 0 ? "+" + fmtFull(profit) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-right ${losses > 0 ? "text-red-500" : "text-zinc-400"}`}>
                      {losses > 0 ? "−" + fmtFull(loss) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${netColor}`}>
                      {net >= 0 ? "+" : "−"}{fmtFull(Math.abs(net))}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${netColor}`}>{pctStr}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className="h-full rounded-full" style={{ width: `${barPct}%`, background: net >= 0 ? "rgb(16 185 129)" : "rgb(239 68 68)" }} />
                        </div>
                        <span className={`min-w-[44px] text-xs font-semibold ${netColor}`}>{pctStr}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-700 dark:border-yellow-900/40 dark:bg-yellow-900/10 dark:text-yellow-400">
        ⚠ Risk is set at <strong>{riskPct}%</strong> of each slot&apos;s capital. The reward-to-risk ratio is{" "}
        <strong>{(targetPct / riskPct).toFixed(1)}:1</strong> — for every rupee risked, the target is {(targetPct / riskPct).toFixed(1)}x. For educational and planning purposes only.
      </div>

    </div>
  );
}
