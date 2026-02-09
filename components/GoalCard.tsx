"use client";
import Image from "next/image";

interface GoalCardProps {
  icon: string;
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function GoalCard({
  icon,
  label,
  value,
  selected,
  onSelect,
}: GoalCardProps) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`card w-full py-3 px-4 text-left transition-all flex items-center ${
        selected ? "card-active" : "hover:border-[var(--text-muted)]"
      }`}
    >
      <div className="w-7 h-7 shrink-0 flex items-center justify-center" style={{ marginRight: 12 }}>
        <Image
          src={icon}
          alt=""
          width={28}
          height={28}
          className="pixel-display object-contain max-w-full max-h-full"
        />
      </div>
      <span className={`text-base ${selected ? "text-[var(--color-primary)] text-glow-cyan" : ""}`}>
        {label}
      </span>
    </button>
  );
}
