"use client";
import { useBeastStore } from "@/lib/store";

const STEPS = ["photo", "hatching", "meet", "name", "goal", "intention", "share", "welcome"];

interface StepDotsProps {
  currentStep: number; // 1-8
}

export function StepDots({ currentStep }: StepDotsProps) {
  const completedSteps = useBeastStore((s) => s.completedSteps);

  return (
    <div className="flex items-center gap-2 mb-4">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isCompleted = completedSteps.includes(step);
        const isCurrent = stepNum === currentStep;

        return (
          <div
            key={step}
            className={`rounded-full transition-all duration-300 ${
              isCurrent
                ? "w-2.5 h-2.5 bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                : isCompleted
                ? "w-2 h-2 bg-[var(--color-primary)]"
                : "w-2 h-2 bg-[var(--border-default)]"
            }`}
          />
        );
      })}
    </div>
  );
}
