"use client";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";

interface EggAnimationProps {
  onTap?: () => void;
}

export function EggAnimation({ onTap }: EggAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [unmuted, setUnmuted] = useState(false);

  const handleTap = useCallback(() => {
    // Unmute video on first tap (autoplay policy requires user gesture)
    if (videoRef.current && !unmuted) {
      videoRef.current.muted = false;
      setUnmuted(true);
    }
    onTap?.();
  }, [unmuted, onTap]);

  // Fallback to static image with CSS animation
  if (videoError) {
    return (
      <div
        className="animate-wobble animate-glow-pulse cursor-pointer"
        onClick={handleTap}
      >
        <Image
          src="/egg.png"
          alt="Mysterious egg"
          width={180}
          height={180}
          priority
          className="pixel-display object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className="w-full flex items-center justify-center cursor-pointer"
      onClick={handleTap}
      style={{ maxWidth: "85vw" }}
    >
      <video
        ref={videoRef}
        src="/egg-animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-2xl"
        style={{ maxHeight: "55vh" }}
        onError={() => setVideoError(true)}
      />
    </div>
  );
}
