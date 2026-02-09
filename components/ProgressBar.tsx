"use client";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  current: number;
  max: number;
  label: string;
}

export function ProgressBar({ current, max, label }: ProgressBarProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(current), 100);
    return () => clearTimeout(timer);
  }, [current]);

  const pct = Math.min((displayed / max) * 100, 100);

  return (
    <div className="w-full max-w-[200px]">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-[family-name:var(--font-chakra)] text-[var(--text-secondary)]">
          {label}
        </span>
        <span className="font-[family-name:var(--font-jetbrains)] text-[var(--color-primary)] text-glow-cyan">
          {displayed}/{max} XP
        </span>
      </div>
      <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-default)]">
        <div
          className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 8px rgba(57, 255, 20, 0.5)",
          }}
        />
      </div>
    </div>
  );
}
