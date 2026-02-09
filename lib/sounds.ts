/**
 * Chiptune sound effects using Web Audio API.
 * No external files needed — pure synthesis.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** Short chiptune "swoosh" for page transitions */
export function playTransitionSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Audio not available
  }
}

/** Short ascending chiptune jingle for XP earned */
export function playXpSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Ascending notes: C5 → E5 → G5 → C6
    const notes = [523, 659, 784, 1047];
    const duration = 0.12;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.15, now + i * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * duration + duration * 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * duration);
      osc.stop(now + i * duration + duration);
    });

    // Final sparkle chord
    const sparkleTime = now + notes.length * duration;
    [1047, 1319].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.1, sparkleTime);
      gain.gain.exponentialRampToValueAtTime(0.001, sparkleTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(sparkleTime);
      osc.stop(sparkleTime + 0.4);
    });
  } catch {
    // Audio not available
  }
}
