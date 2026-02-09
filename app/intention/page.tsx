"use client";
import { useState, useMemo } from "react";
import { useBeastStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { usePageTransition } from "@/lib/usePageTransition";
import { StepDots } from "@/components/StepDots";

const PLACEHOLDERS = [
  "I want to be more mindful...",
  "Track my progress...",
  "Build a daily habit...",
  "Reflect on my thoughts...",
  "Stay accountable to my goals...",
];

export default function IntentionScreen() {
  const { navigate, exitClass } = usePageTransition();
  const setIntention = useBeastStore((s) => s.setIntention);
  const completeStep = useBeastStore((s) => s.completeStep);

  const placeholder = useMemo(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)],
    []
  );
  const [text, setText] = useState("");

  const handleSave = () => {
    setIntention(text.trim() || null);
    if (text.trim()) {
      completeStep("intention", 10);
    }
    track(text.trim() ? "intention_written" : "intention_skipped", {
      length: text.trim().length,
    });
    navigate("/share");
  };

  const handleSkip = () => {
    setIntention(null);
    track("intention_skipped");
    navigate("/share");
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 page-transition ${exitClass}`}>
      <StepDots currentStep={6} />
      <h1 className="text-2xl font-bold mb-2 text-center font-[family-name:var(--font-chakra)] text-[var(--color-primary)] text-glow-cyan">
        Why do you want to start journaling?
      </h1>

      <p className="text-[var(--text-muted)] text-sm mb-4 text-center">
        Optional — helps us understand what matters to you
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 280))}
        placeholder={placeholder}
        rows={4}
        className="input-field max-w-xs resize-none"
      />

      <p className="text-[var(--text-muted)] text-xs mt-2 font-[family-name:var(--font-jetbrains)]">
        {text.length}/280
      </p>

      <button onClick={handleSave} className="btn-primary mt-4">
        Save (+10 XP)
      </button>

      <button onClick={handleSkip} className="btn-ghost mt-4">
        Skip
      </button>
    </div>
  );
}
