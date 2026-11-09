import { CapitalSlotPlanner } from "@/components/CapitalSlotPlanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Capital Slot Planner",
  description: "10-slot equal capital allocation planner with risk management and profit scenario analysis.",
};

export default function CapitalPlannerPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              ← Investment Calculator
            </Link>
            <span className="font-mono text-xs text-zinc-300 dark:text-zinc-700">|</span>
            <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Capital Slot Planner
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Suspense>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-zinc-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-lg border border-blue-500 bg-blue-500 px-3 py-2 font-mono text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <CapitalSlotPlanner />
      </main>
    </div>
  );
}
