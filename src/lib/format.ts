export const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const pct = new Intl.NumberFormat("en-IN", {
  style: "percent",
  maximumFractionDigits: 2,
});

export function formatINR(value: number) {
  if (!Number.isFinite(value)) return inr.format(0);
  return inr.format(Math.round(value));
}

