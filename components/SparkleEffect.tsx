"use client";

const SPARKLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${8 + Math.random() * 84}%`,
  top: `${8 + Math.random() * 84}%`,
  delay: `${Math.random() * 2}s`,
  size: 4 + Math.random() * 8,
}));

export function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {SPARKLES.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            width: s.size,
            height: s.size,
          }}
        >
          <svg viewBox="0 0 24 24" fill="#00E5FF" opacity={0.6}>
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
