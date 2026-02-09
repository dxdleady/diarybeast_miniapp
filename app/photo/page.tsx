"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useBeastStore } from "@/lib/store";
import { getImageTemperature } from "@/lib/beasts";
import { track } from "@/lib/analytics";
import { usePageTransition } from "@/lib/usePageTransition";
import { StepDots } from "@/components/StepDots";

export default function PhotoScreen() {
  const { navigate, exitClass } = usePageTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const setPhotoUploaded = useBeastStore((s) => s.setPhotoUploaded);
  const setPhotoSkipped = useBeastStore((s) => s.setPhotoSkipped);
  const completeStep = useBeastStore((s) => s.completeStep);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setProcessing(true);

    const temp = await getImageTemperature(file);
    setPhotoUploaded(url, temp);
    completeStep("photo", 10);
    track("photo_uploaded", { temperature: temp });
    setProcessing(false);
  };

  const handleRetake = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    fileRef.current?.click();
  };

  const handleContinue = () => navigate("/hatching");

  const handleSkip = () => {
    setPhotoSkipped();
    track("photo_skipped");
    navigate("/hatching");
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 page-transition ${exitClass}`}>
      <StepDots currentStep={1} />
      <h1 className="text-2xl font-bold mb-2 text-center font-[family-name:var(--font-chakra)] text-[var(--color-primary)] text-glow-cyan">
        Want your Beast to look like you?
      </h1>

      <p className="text-white text-center mb-4 text-sm max-w-xs leading-relaxed">
        Your photo&apos;s <span className="text-[#00E5FF]">colors</span> influence which <span className="text-[#FFD700]">Beast</span> you get — <span className="text-[#FF6B00]">warm tones</span> summon <span className="text-[#E8913A]">cats</span> &amp; <span className="text-[#D49040]">dogs</span>, <span className="text-[#4A8ED5]">cool tones</span> summon <span className="text-[#39FF14]">parrots</span>
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {preview ? (
        <div className="flex flex-col items-center gap-4 animate-fade-in w-full max-w-xs">
          <div className="lcd-screen p-4 rounded-xl">
            <Image
              src={preview}
              alt="Your photo"
              width={200}
              height={200}
              className="rounded-lg object-cover"
              style={{ width: 200, height: 200 }}
            />
          </div>

          {processing ? (
            <p className="text-[var(--color-primary)] text-sm text-glow-cyan font-[family-name:var(--font-jetbrains)]">
              Analyzing colors...
            </p>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <button onClick={handleContinue} className="btn-primary w-full">
                Continue
              </button>
              <button onClick={handleRetake} className="btn-ghost">
                Choose different photo
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-primary w-full"
          >
            Add Photo (+10 XP)
          </button>
          <button onClick={handleSkip} className="btn-ghost">
            Skip
          </button>
        </div>
      )}

      <link rel="preload" href="/hatching.mp4" as="video" />
    </div>
  );
}
