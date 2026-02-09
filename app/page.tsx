"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { EggAnimation } from "@/components/EggAnimation";
import { initAnalytics, track } from "@/lib/analytics";
import { usePageTransition } from "@/lib/usePageTransition";

export default function EggScreen() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { navigate, exitClass } = usePageTransition("egg");
  const [started, setStarted] = useState(false);
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    initAnalytics();
    if (!isFrameReady) {
      setFrameReady();
    }
    track("app_opened");
  }, [setFrameReady, isFrameReady]);

  const handleStart = () => {
    track("start_journey");
    setStarted(true);
  };

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    track("egg_tapped");
    setTimeout(() => navigate("/photo"), 5000);
  };

  // Phase 2: Egg animation (after Start)
  if (started) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center relative page-transition ${exitClass}`}>
        <EggAnimation onTap={handleTap} />
        <p className="mt-8 text-[var(--text-secondary)] text-lg animate-fade-in font-[family-name:var(--font-chakra)]">
          {tapped ? "Hatching..." : "Tap to hatch"}
        </p>
      </div>
    );
  }

  // Phase 1: Branded landing
  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-8 py-10 page-transition ${exitClass}`}>
      <p className="text-[var(--text-secondary)] text-sm mb-8">
        Your onchain Tamagotchi diary
      </p>

      {/* Egg preview */}
      <Image
        src="/egg.png"
        alt="Mysterious egg"
        width={140}
        height={140}
        priority
        className="pixel-display object-contain animate-breathe animate-glow-pulse mb-8"
      />

      {/* Description */}
      <p className="text-white text-center text-sm max-w-xs leading-relaxed mb-4">
        <span className="text-[#00E5FF]">Hatch</span> a unique <span className="text-[#FFD700]">Beast</span>, <span className="text-[#00E5FF]">name</span> it, and start your <span className="text-[#39FF14]">journaling journey</span> onchain.
      </p>

      {/* CTA */}
      <button onClick={handleStart} className="btn-primary">
        Start Your Journey
      </button>

      {/* Footer */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[var(--text-muted)] text-xs">Built on</span>
        <Image
          src="/base-logo.png"
          alt="Base"
          width={16}
          height={16}
          className="object-contain rounded-[3px]"
        />
        <span className="text-[var(--text-muted)] text-xs font-medium">Base</span>
      </div>
    </div>
  );
}
