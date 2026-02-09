"use client";
import { useState, useMemo } from "react";
import { Beast } from "@/components/Beast";
import { useBeastStore } from "@/lib/store";
import { getRandomNameSuggestion } from "@/lib/beasts";
import { track } from "@/lib/analytics";
import { usePageTransition } from "@/lib/usePageTransition";
import { StepDots } from "@/components/StepDots";

export default function NameScreen() {
  const { navigate, exitClass } = usePageTransition();
  const beastVariant = useBeastStore((s) => s.beastVariant);
  const setBeastName = useBeastStore((s) => s.setBeastName);
  const completeStep = useBeastStore((s) => s.completeStep);

  const placeholder = useMemo(() => getRandomNameSuggestion(), []);
  const [name, setName] = useState("");

  const handleConfirm = () => {
    const finalName = name.trim() || placeholder;
    setBeastName(finalName);
    completeStep("name", 10);
    track(name.trim() ? "name_custom" : "name_default", { name: finalName });
    navigate("/goal");
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 page-transition ${exitClass}`}>
      <StepDots currentStep={4} />
      <div className="mb-6">
        <Beast variant={beastVariant} size={120} />
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center font-[family-name:var(--font-chakra)] text-[var(--color-primary)] text-glow-cyan">
        Name your Beast
      </h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 20))}
        placeholder={placeholder}
        className="input-field max-w-xs text-center text-lg"
      />

      <p className="text-[var(--text-muted)] text-xs mt-2 font-[family-name:var(--font-jetbrains)]">
        {name.length}/20
      </p>

      <button onClick={handleConfirm} className="btn-primary mt-4">
        Confirm (+10 XP)
      </button>
    </div>
  );
}
