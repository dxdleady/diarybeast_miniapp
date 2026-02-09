"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Beast } from "@/components/Beast";
import { SparkleEffect } from "@/components/SparkleEffect";
import { useBeastStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { StepDots } from "@/components/StepDots";

export default function HatchingScreen() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const beastVariant = useBeastStore((s) => s.beastVariant);
  const completeStep = useBeastStore((s) => s.completeStep);

  useEffect(() => {
    completeStep("hatching", 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnded = () => {
    track("hatching_completed");
    router.push("/meet");
  };

  const handleError = () => {
    setVideoError(true);
    setTimeout(handleEnded, 3000);
  };

  if (videoError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative page-transition">
        <StepDots currentStep={2} />
        <SparkleEffect />
        <Beast variant={beastVariant} size={250} />
        <p className="mt-6 text-[var(--text-secondary)] animate-fade-in font-[family-name:var(--font-chakra)]">
          Your Beast is arriving...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0E1A] flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        onEnded={handleEnded}
        onError={handleError}
        onLoadedMetadata={() => {
          if (videoRef.current) videoRef.current.playbackRate = 1.5;
        }}
        className="w-full h-full object-contain"
      >
        <source src="/hatching.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
