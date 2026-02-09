"use client";
import { useComposeCast } from "@coinbase/onchainkit/minikit";
import { Beast } from "@/components/Beast";
import { useBeastStore } from "@/lib/store";
import { getBeastDisplayName } from "@/lib/beasts";
import { track } from "@/lib/analytics";
import { usePageTransition } from "@/lib/usePageTransition";
import { StepDots } from "@/components/StepDots";

export default function ShareScreen() {
  const { navigate, exitClass } = usePageTransition();
  const { composeCast } = useComposeCast();
  const beastVariant = useBeastStore((s) => s.beastVariant);
  const beastName = useBeastStore((s) => s.beastName);
  const completeStep = useBeastStore((s) => s.completeStep);

  const handleShare = () => {
    composeCast({
      text: `Meet ${beastName} the ${getBeastDisplayName(beastVariant)} \u{2014} my Beast on DiaryBeast \u{1F43E}\nReady to grow onchain \u{1F331}`,
      embeds: [`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/share/${beastVariant}`],
    });
    completeStep("share", 1000);
    track("beast_shared");
  };

  const handleSkip = () => {
    track("share_skipped");
    navigate("/welcome");
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 page-transition ${exitClass}`}>
      <StepDots currentStep={7} />
      <div className="lcd-screen p-4 mb-6">
        <Beast variant={beastVariant} size={180} />
      </div>

      <h2 className="text-xl font-bold mb-2 font-[family-name:var(--font-chakra)] text-[var(--color-primary)] text-glow-cyan">
        {beastName}
      </h2>

      <p className="text-[var(--text-secondary)] text-center text-sm mb-2">
        {beastName} is ready to grow onchain
      </p>

      <p className="text-[var(--color-accent)] text-sm font-bold mb-4 font-[family-name:var(--font-jetbrains)] text-glow-green">
        +1000 XP for sharing
      </p>

      <button onClick={handleShare} className="btn-primary">
        Share in Feed
      </button>

      <button onClick={handleSkip} className="btn-ghost mt-4">
        Skip for now
      </button>
    </div>
  );
}
