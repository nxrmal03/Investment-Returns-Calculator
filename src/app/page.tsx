"use client";

import { InvestmentForm, type InvestmentFormErrors, type InvestmentFormValues } from "@/components/InvestmentForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ReturnsPieChart } from "@/components/ReturnsPieChart";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { calculateReturns } from "@/lib/finance";
import { formatINR } from "@/lib/format";
import { useMemo, useState } from "react";

const DEFAULTS: InvestmentFormValues = {
  principal: "100000",
  annualRatePct: "12",
  years: 10,
  mode: "lumpsum",
  monthlyInvestment: "5000",
};

function parseNumber(input: string) {
  const cleaned = input.replace(/,/g, "").trim();
  if (!cleaned) return NaN;
  return Number(cleaned);
}

function validate(values: InvestmentFormValues): InvestmentFormErrors {
  const errors: InvestmentFormErrors = {};

  const principal = parseNumber(values.principal);
  const rate = parseNumber(values.annualRatePct);
  const years = values.years;
  const monthly = parseNumber(values.monthlyInvestment);

  if (!Number.isFinite(principal) || principal < 0) {
    errors.principal = "Enter a valid non-negative amount.";
  }

  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    errors.annualRatePct = "Enter a rate between 0 and 100.";
  }

  if (!Number.isFinite(years) || years < 0 || years > 60) {
    errors.years = "Enter a time period between 0 and 60 years.";
  }

  if (values.mode === "sip") {
    if (!Number.isFinite(monthly) || monthly < 0) {
      errors.monthlyInvestment = "Enter a valid non-negative monthly amount.";
    }
  }

  return errors;
}

export default function Home() {
  const [values, setValues] = useState<InvestmentFormValues>(DEFAULTS);
  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const result = useMemo(() => {
    if (hasErrors) {
      return { totalInvested: 0, totalValue: 0, estimatedReturns: 0 };
    }

    return calculateReturns({
      principal: parseNumber(values.principal),
      annualRatePct: parseNumber(values.annualRatePct),
      years: values.years,
      mode: values.mode,
      monthlyInvestment:
        values.mode === "sip" ? parseNumber(values.monthlyInvestment) : undefined,
    });
  }, [hasErrors, values]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(14,165,233,0.18),transparent_40%),radial-gradient(900px_circle_at_80%_10%,rgba(34,197,94,0.16),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,1),rgba(245,245,245,1))] px-4 py-10 transition-colors dark:bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(14,165,233,0.14),transparent_40%),radial-gradient(900px_circle_at_80%_10%,rgba(34,197,94,0.12),transparent_42%),linear-gradient(to_bottom,rgba(7,7,10,1),rgba(0,0,0,1))] sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300">
              Portfolio-grade • Next.js • Tailwind • Recharts
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Investment Returns Calculator
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Real-time compound growth using \(A = P(1 + r/100)^t\). Switch to
              SIP mode to include monthly contributions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/capital-planner"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-zinc-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              Capital Slot Planner →
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <InvestmentForm values={values} errors={errors} onChange={setValues} />

            <div className="rounded-2xl border border-black/5 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/40 sm:p-6">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Quick note
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                This is an estimate for educational purposes. Markets fluctuate,
                and actual returns can differ.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Pill label="INR formatting" value={formatINR(1234567)} />
                <Pill label="Real-time updates" value="Enabled" />
                <Pill
                  label="Validation"
                  value={hasErrors ? "Fix inputs" : "All good"}
                  tone={hasErrors ? "danger" : "success"}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ResultsDisplay
              totalInvested={result.totalInvested}
              estimatedReturns={result.estimatedReturns}
              totalValue={result.totalValue}
            />
            <ReturnsPieChart
              invested={result.totalInvested}
              returns={result.estimatedReturns}
            />
          </div>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Built with Next.js App Router, Tailwind CSS, and Recharts.
          </span>
          <span className="tabular-nums">
            Mode:{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {values.mode === "sip" ? "SIP" : "Lump sum"}
            </span>
          </span>
        </footer>
      </div>
    </div>
  );
}

function Pill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-300/60 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100"
      : tone === "danger"
        ? "border-rose-300/70 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
        : "border-black/10 bg-white/60 text-zinc-700 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300";

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-medium transition",
        toneClass,
      ].join(" ")}
    >
      <span className="opacity-80">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
