"use client";
import { useEffect } from "react";
import { Beast } from "@/components/Beast";
import { SparkleEffect } from "@/components/SparkleEffect";
import { useBeastStore } from "@/lib/store";
import { getBeastDisplayName } from "@/lib/beasts";
import { track } from "@/lib/analytics";
import { usePageTransition } from "@/lib/usePageTransition";
import { StepDots } from "@/components/StepDots";

export default function MeetScreen() {
  const { navigate, exitClass } = usePageTransition();
  const beastVariant = useBeastStore((s) => s.beastVariant);
  const photoUploaded = useBeastStore((s) => s.photoUploaded);
  const rerollsLeft = useBeastStore((s) => s.rerollsLeft);
  const reroll = useBeastStore((s) => s.reroll);
  const completeStep = useBeastStore((s) => s.completeStep);

  useEffect(() => {
    completeStep("meet", 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReroll = () => {
    const newVariant = reroll();
    track("reroll_count", { variant: newVariant, remaining: rerollsLeft - 1 });
  };

  const handleContinue = () => {
    track("beast_variant_chosen", { variant: beastVariant });
    navigate("/name");
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 relative page-transition ${exitClass}`}>
      <StepDots currentStep={3} />
      <SparkleEffect />

      <h1 className="text-2xl font-bold mb-1 text-center font-[family-name:var(--font-chakra)] text-[var(--color-primary)] text-glow-cyan animate-fade-in">
        {photoUploaded
          ? "Born from your essence!"
          : "Your Beast has arrived!"}
      </h1>

      <p className="text-[var(--color-accent)] text-xs font-bold mb-2 font-[family-name:var(--font-jetbrains)] animate-fade-in">
        +5 XP
      </p>

      <p className="text-[var(--text-secondary)] text-sm mb-6 font-[family-name:var(--font-jetbrains)]">
        {getBeastDisplayName(beastVariant)}
      </p>

      <div className="lcd-screen p-4 mb-6">
        <Beast variant={beastVariant} size={200} />
      </div>

      {rerollsLeft > 0 ? (
        <button onClick={handleReroll} className="btn-ghost mb-4 text-sm">
          Try another? ({rerollsLeft} left)
        </button>
      ) : (
        <p className="text-[var(--text-muted)] text-sm mb-4">
          Want more? Coming soon
        </p>
      )}

      <button onClick={handleContinue} className="btn-primary">
        Continue
      </button>
    </div>
  );
}
