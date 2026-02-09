"use client";
import { useState } from "react";
import { GoalCard } from "@/components/GoalCard";
import { useBeastStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { usePageTransition } from "@/lib/usePageTransition";
import { StepDots } from "@/components/StepDots";

const GOALS = [
  { icon: "/icon_mental.png", label: "Mental Health & Reflection", value: "mental_health" },
  { icon: "/icon_fitness.png", label: "Fitness & Wellness", value: "fitness" },
  { icon: "/icon_finance.png", label: "Finance & Investments", value: "finance" },
  { icon: "/icon_creative.png", label: "Creative Writing", value: "creative" },
  { icon: "/icon_growth.png", label: "Personal Growth", value: "growth" },
];

export default function GoalScreen() {
  const { navigate, exitClass } = usePageTransition();
  const setGoal = useBeastStore((s) => s.setGoal);
  const completeStep = useBeastStore((s) => s.completeStep);
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setGoal(selected);
    completeStep("goal", 10);
    track("goal_selected", { goal: selected });
    navigate("/intention");
  };

  const handleSkip = () => {
    track("goal_skipped");
    navigate("/intention");
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 page-transition ${exitClass}`}>
      <StepDots currentStep={5} />
      <h1 className="text-2xl font-bold mb-6 text-center font-[family-name:var(--font-chakra)] text-[var(--color-primary)] text-glow-cyan">
        What brings you here?
      </h1>

      <div className="w-full max-w-xs flex flex-col gap-2 mb-4">
        {GOALS.map((g) => (
          <GoalCard
            key={g.value}
            icon={g.icon}
            label={g.label}
            value={g.value}
            selected={selected === g.value}
            onSelect={setSelected}
          />
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="btn-primary"
      >
        Continue (+10 XP)
      </button>

      <button onClick={handleSkip} className="btn-ghost mt-4">
        Skip
      </button>
    </div>
  );
}
