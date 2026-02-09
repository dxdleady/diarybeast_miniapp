"use client";
import { useEffect, useState } from "react";
import { useAddFrame, useComposeCast } from "@coinbase/onchainkit/minikit";
import { Beast } from "@/components/Beast";
import { SparkleEffect } from "@/components/SparkleEffect";
import { ProgressBar } from "@/components/ProgressBar";
import { useBeastStore } from "@/lib/store";
import { getBeastDisplayName } from "@/lib/beast-data";
import { track } from "@/lib/analytics";
import { playXpSound } from "@/lib/sounds";
import { usePageTransition } from "@/lib/usePageTransition";
import { StepDots } from "@/components/StepDots";

export default function WelcomeScreen() {
  const addFrame = useAddFrame();
  const { composeCast } = useComposeCast();
  const { navigate } = usePageTransition();
  const beastVariant = useBeastStore((s) => s.beastVariant);
  const beastName = useBeastStore((s) => s.beastName);
  const xp = useBeastStore((s) => s.xp);
  const completedSteps = useBeastStore((s) => s.completedSteps);
  const completeStep = useBeastStore((s) => s.completeStep);
  const subscribed = useBeastStore((s) => s.subscribed);
  const setSubscribed = useBeastStore((s) => s.setSubscribed);
  const reset = useBeastStore((s) => s.reset);

  const [displayedXp, setDisplayedXp] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const soundTimeout = setTimeout(() => playXpSound(), 300);

    let current = 0;
    const target = xp;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setDisplayedXp(current);
    }, 20);

    return () => {
      clearInterval(interval);
      clearTimeout(soundTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async () => {
    try {
      const result = await addFrame();
      if (result) {
        setSubscribed();
        track("subscribed");
        setDone(true);
      }
    } catch {
      // User cancelled
    }
  };

  const hasShared = (completedSteps ?? []).includes("share");

  const handleShare = () => {
    const displayName = getBeastDisplayName(beastVariant);
    composeCast({
      text: `Meet ${beastName} the ${displayName} \u{2014} my Beast on DiaryBeast \u{1F43E}\nReady to grow onchain \u{1F331}`,
      embeds: [`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/share/${beastVariant}`],
    });
    completeStep("share", 1000);
    track("beast_shared_welcome");
  };

  const handleHatchAnother = () => {
    reset();
    track("hatch_another");
    navigate("/");
  };

  if (done || subscribed) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative page-transition">
        <StepDots currentStep={8} />
        <SparkleEffect />
        <h1 className="text-3xl font-bold mb-6 animate-fade-in font-[family-name:var(--font-chakra)] text-[var(--color-accent)] text-glow-green">
          You&apos;re in!
        </h1>
        <Beast variant={beastVariant} size={140} />
        <p className="mt-6 text-[var(--text-secondary)] text-center max-w-xs">
          {beastName} will be waiting for you when DiaryBeast launches on Base.
        </p>

        {/* Divider */}
        <p className="mt-4 mb-4 text-[var(--text-muted)] text-xs tracking-wider uppercase">
          While you wait
        </p>

        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <button onClick={handleShare} className="btn-primary w-full">
            {hasShared ? "Share Your Beast" : "Share Your Beast (+1000 XP)"}
          </button>

          <a
            href="https://app.diarybeast.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost w-full inline-block text-center"
          >
            Try the Web Demo
          </a>

          <button onClick={handleHatchAnother} className="btn-ghost w-full">
            Hatch Another Beast
          </button>
        </div>

        <p className="mt-6 text-[var(--text-muted)] text-xs text-center max-w-xs">
          We&apos;ll notify you via Farcaster when we launch. Bonus XP for early sign-ups.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative page-transition">
      <StepDots currentStep={8} />
      <SparkleEffect />

      {xp > 0 ? (
        <>
          <div className="text-2xl font-bold text-[var(--color-accent)] mb-3 animate-fade-in font-[family-name:var(--font-jetbrains)] text-glow-green">
            +{displayedXp} XP
          </div>
          <ProgressBar current={xp} max={1055} label={`${xp} XP earned`} />
        </>
      ) : (
        <h2 className="text-xl font-bold text-[var(--color-primary)] mb-3 animate-fade-in font-[family-name:var(--font-chakra)] text-glow-cyan">
          Welcome, {beastName || "Trainer"}!
        </h2>
      )}

      {xp > 0 && (
        <p className="text-[var(--text-muted)] text-center text-xs mt-2 mb-6 max-w-[220px] leading-relaxed">
          Spend XP on upgrades for your Beast and AI-powered journal insights
        </p>
      )}

      <div className="lcd-screen p-4 mb-6">
        <Beast variant={beastVariant} size={120} />
      </div>

      <p className="text-[var(--text-muted)] text-center text-sm mb-6 max-w-xs leading-relaxed">
        Your Beast needs daily entries to grow. Join the waitlist to be first
        when we launch.
      </p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {!hasShared && (
          <button onClick={handleShare} className="btn-primary w-full">
            Share Your Beast (+1000 XP)
          </button>
        )}

        <button onClick={handleSubscribe} className={`${hasShared ? "btn-primary" : "btn-ghost"} w-full`}>
          Subscribe &amp; Join Waitlist
        </button>
      </div>

      <p className="mt-4 text-[var(--color-accent)] text-xs text-center font-[family-name:var(--font-jetbrains)]">
        +500 bonus XP on your first spend
      </p>

      <p className="mt-3 text-[var(--text-muted)] text-xs text-center">
        We&apos;ll notify you when DiaryBeast launches on Base
      </p>
    </div>
  );
}
