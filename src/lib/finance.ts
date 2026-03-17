export type Mode = "lumpsum" | "sip";

export type CalculatorInputs = {
  principal: number; // ₹
  annualRatePct: number; // %
  years: number;
  mode: Mode;
  monthlyInvestment?: number; // ₹ (SIP)
};

export type CalculatorResult = {
  totalInvested: number;
  totalValue: number;
  estimatedReturns: number;
};

function clampFinite(n: number) {
  return Number.isFinite(n) ? n : 0;
}

export function calculateReturns(input: CalculatorInputs): CalculatorResult {
  const P = Math.max(0, clampFinite(input.principal));
  const r = clampFinite(input.annualRatePct);
  const t = Math.max(0, clampFinite(input.years));

  if (input.mode === "sip") {
    const pmt = Math.max(0, clampFinite(input.monthlyInvestment ?? 0));
    const n = Math.round(t * 12);
    const i = r / 100 / 12;

    const fvLump = n === 0 ? P : P * Math.pow(1 + i, n);

    const fvSip =
      n === 0
        ? 0
        : i === 0
          ? pmt * n
          : pmt * ((Math.pow(1 + i, n) - 1) / i);

    const totalValue = fvLump + fvSip;
    const totalInvested = P + pmt * n;
    const estimatedReturns = totalValue - totalInvested;

    return { totalInvested, totalValue, estimatedReturns };
  }

  const A = P * Math.pow(1 + r / 100, t);
  return {
    totalInvested: P,
    totalValue: A,
    estimatedReturns: A - P,
  };
}

