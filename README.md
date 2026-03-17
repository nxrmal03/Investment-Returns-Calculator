# Investment Returns Calculator (Next.js + React + Tailwind + Recharts)

A modern, responsive investment returns calculator built with **Next.js App Router**, **Tailwind CSS**, and **Recharts**. It supports **lump sum** and **SIP (monthly contribution)** modes, real-time calculation, validation, INR formatting, and dark mode.

## Features

- **Inputs**:
  - Investment amount (₹) / Initial investment (₹)
  - Expected annual return rate (%)
  - Time period (years) with **slider**
  - **SIP mode** with monthly investment (₹)
- **Outputs**:
  - Total invested amount
  - Estimated returns (profit)
  - Total value (invested + returns)
- **Visualization**:
  - Pie chart (Invested vs Returns) with Recharts
- **UX**:
  - Responsive, fintech-style UI
  - Real-time updates
  - Input validation + friendly error messages
  - Dark mode (system/light/dark)

## Formulas

### Lump sum (compound interest)
\[
A = P(1 + r/100)^t
\]

### SIP (monthly contribution)
Uses monthly compounding:
- Monthly rate: \(i = r/100/12\)
- Months: \(n = 12t\)
- Future value of monthly contributions (end of month):
  - \(FV = PMT \cdot \frac{(1+i)^n - 1}{i}\) (or \(PMT \cdot n\) when \(i = 0\))

## Tech stack / dependencies

- **Next.js** (App Router)
- **React** (function components + hooks)
- **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **next-themes** (dark mode)

## Getting started (local)

From the project folder:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project structure

- `src/app/`: Next.js routes + global styles
- `src/components/`: UI components (`InvestmentForm`, `ResultsDisplay`, `ReturnsPieChart`, theme components)
- `src/lib/`: calculation + formatting helpers
