"use client";
import Image from "next/image";
import { getBeastImage } from "@/lib/beasts";

interface BeastProps {
  variant: string;
  size?: number;
  animate?: boolean;
}

export function Beast({ variant, size = 200, animate = true }: BeastProps) {
  const src = getBeastImage(variant);

  return (
    <div className={`relative ${animate ? "animate-breathe" : ""}`}>
      <Image
        src={src}
        alt="Your Beast"
        width={size}
        height={size}
        priority
        className="pixel-display object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]"
      />
    </div>
  );
}
