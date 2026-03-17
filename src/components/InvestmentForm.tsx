"use client";

import type { Mode } from "@/lib/finance";
import type { HTMLAttributes } from "react";

export type InvestmentFormValues = {
  principal: string;
  annualRatePct: string;
  years: number;
  mode: Mode;
  monthlyInvestment: string;
};

export type InvestmentFormErrors = Partial<
  Record<keyof InvestmentFormValues, string>
>;

export function InvestmentForm({
  values,
  errors,
  onChange,
}: {
  values: InvestmentFormValues;
  errors: InvestmentFormErrors;
  onChange: (next: InvestmentFormValues) => void;
}) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur transition dark:border-white/10 dark:bg-zinc-950/50 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Inputs
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Values update instantly as you type.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 p-1 text-sm dark:border-white/10 dark:bg-zinc-950/40">
          <button
            type="button"
            onClick={() => onChange({ ...values, mode: "lumpsum" })}
            className={[
              "rounded-full px-3 py-1.5 transition",
              values.mode === "lumpsum"
                ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                : "text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10",
            ].join(" ")}
          >
            Lump sum
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...values, mode: "sip" })}
            className={[
              "rounded-full px-3 py-1.5 transition",
              values.mode === "sip"
                ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                : "text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10",
            ].join(" ")}
          >
            SIP
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label={values.mode === "sip" ? "Initial investment (₹)" : "Investment amount (₹)"}
          hint="Principal amount"
          value={values.principal}
          inputMode="decimal"
          placeholder="e.g., 100000"
          error={errors.principal}
          onChange={(v) => onChange({ ...values, principal: v })}
        />

        <Field
          label="Expected annual return (%)"
          hint="Compounded"
          value={values.annualRatePct}
          inputMode="decimal"
          placeholder="e.g., 12"
          error={errors.annualRatePct}
          onChange={(v) => onChange({ ...values, annualRatePct: v })}
        />

        {values.mode === "sip" ? (
          <Field
            label="Monthly investment (₹)"
            hint="SIP contribution"
            value={values.monthlyInvestment}
            inputMode="decimal"
            placeholder="e.g., 5000"
            error={errors.monthlyInvestment}
            onChange={(v) => onChange({ ...values, monthlyInvestment: v })}
          />
        ) : (
          <div className="hidden sm:block" />
        )}

        <div className="rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-zinc-950/30">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Time period (years)
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Use the slider or type a value
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-20 rounded-lg border border-black/10 bg-white px-3 py-2 text-right text-sm font-semibold text-zinc-950 shadow-sm outline-none ring-0 transition focus:border-zinc-950/40 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-white/30"
                type="number"
                min={0}
                step={0.5}
                value={values.years}
                onChange={(e) =>
                  onChange({
                    ...values,
                    years: Number.isFinite(e.target.valueAsNumber)
                      ? e.target.valueAsNumber
                      : 0,
                  })
                }
              />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                yrs
              </span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={40}
            step={0.5}
            value={values.years}
            onChange={(e) => onChange({ ...values, years: Number(e.target.value) })}
            className="mt-4 w-full accent-zinc-950 dark:accent-white"
          />

          {errors.years ? (
            <div className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
              {errors.years}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  value,
  placeholder,
  inputMode,
  error,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-zinc-950/30">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </span>
        {hint ? (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {hint}
          </span>
        ) : null}
      </div>
      <input
        className="mt-3 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950/40 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/30"
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <div className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </div>
      ) : null}
    </label>
  );
}

