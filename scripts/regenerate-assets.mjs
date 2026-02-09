#!/usr/bin/env node
/**
 * Regenerate assets using latest Google AI models.
 * - Egg static: Gemini (pixel art, transparent bg)
 * - Egg animation: Veo 3.1 (looping wobble + glow)
 * - Hatching video: Veo 3.1 (HD, native audio, egg unpacking)
 */

import { GoogleGenAI } from '@google/genai';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error('Set GOOGLE_API_KEY in .env.local');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ── 1. Regenerate egg static image ──────────────────────────────────

async function generateEgg() {
  console.log('Generating egg.png...');

  const prompt = `Retro Tamagotchi virtual pet pixel art, 64x64 pixels, monochrome LCD screen aesthetic, simple geometric shapes, cute kawaii style, thick black outlines, limited color palette (2-3 colors max), 8-bit nostalgic gaming aesthetic, front-facing symmetric design, centered composition, transparent background, no anti-aliasing, no gradients, no blur.

A magical glowing egg, oval shape, perfectly centered. The egg has a soft pastel shell with tiny pixel cracks that glow cyan (#00E5FF). Small sparkle pixels float around the egg. The egg sits on nothing — completely transparent background, no ground, no shadow. Clean pixel edges, sharp outlines, retro LCD game style.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const buffer = Buffer.from(part.inlineData.data, 'base64');
      const outPath = 'public/egg.png';
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, buffer);
      console.log(`  Saved ${outPath} (${buffer.length} bytes)`);
      await removeGreenBg(outPath);
      return;
    }
  }
  console.error('  No image generated for egg');
}

// ── 2. Generate egg animation (looping wobble video) ────────────────

async function generateEggAnimation() {
  console.log('\nGenerating egg-animation.mp4 with Veo 3.1...');

  const prompt = `A seamlessly looping animation of a pixel art Tamagotchi egg. Dark navy background (#0A0E1A).

The egg is centered on screen, drawn in clean 8-bit pixel art style with thick black outlines. It has a soft pastel shell with glowing cyan cracks.

The egg gently wobbles side to side in a smooth repeating loop. Cyan sparkle pixels softly pulse and float around the egg. A subtle glow emanates from the cracks, breathing brighter and dimmer. Small pixel stars twinkle around it.

The animation should feel hypnotic and inviting — like a Tamagotchi waiting to be interacted with.

Style: pixel art, 8-bit, retro LCD game, Tamagotchi, clean sharp pixels, thick outlines.
Colors: dark navy (#0A0E1A) background, pastel egg shell, cyan (#00E5FF) glow, subtle sparkles.
Camera: Static, perfectly centered.
Audio: Soft ambient chiptune hum, gentle 8-bit sparkle sounds, low mysterious pulse.
Mood: Mysterious, inviting, anticipation.`;

  const operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    source: { prompt },
    config: {
      aspectRatio: '9:16',
      numberOfVideos: 1,
      durationSeconds: 4,
      resolution: '720p',
    },
  });

  let result = operation;
  let pollCount = 0;
  while (!result.done) {
    pollCount++;
    console.log(`  Polling egg animation... (${pollCount * 10}s)`);
    await sleep(10000);
    result = await ai.operations.getVideosOperation({ operation: result });
  }

  const videos = result.response?.generatedVideos;
  if (!videos || videos.length === 0) {
    console.error('  No egg animation generated');
    return;
  }

  const outPath = 'public/egg-animation.mp4';
  await ai.files.download({
    file: videos[0],
    downloadPath: outPath,
  });

  console.log(`  Saved ${outPath}`);
}

// ── 3. Generate hatching video ──────────────────────────────────────

async function generateHatchingVideo() {
  console.log('\nGenerating hatching.mp4 with Veo 3.1...');

  const prompt = `A retro pixel art Tamagotchi-style egg hatching animation. Dark navy background (#0A0E1A).

Opening shot: A glowing pixel art egg sits centered on screen, softly pulsing with cyan light. It's a classic LCD-style egg with thick black outlines, 8-bit aesthetic.

The egg begins to wobble gently, then more vigorously. Tiny cyan and green sparkle pixels appear around it. Cracks form on the shell — glowing bright lines spreading across the surface.

The egg SPLITS OPEN dramatically — shell fragments scatter as pixel particles. A brilliant burst of light erupts from inside, cyan and neon green (#39FF14) rays shooting outward. Sparkles and confetti pixels rain down.

Through the light, a mysterious silhouette of a small round creature appears — but its details are hidden in the glow. We see only big sparkling eyes peering out from the light.

The glow settles into a warm aura. The mystery creature remains obscured — just eyes and a cute round shadow. A question mark pixel floats above.

Style: pixel art, 8-bit, retro LCD game, Tamagotchi, clean sharp pixels, no anti-aliasing, thick outlines. Colors: dark navy, cyan glow, neon green accents, warm sparkles.
Camera: Static, centered, front-facing.
Audio: Retro chiptune music, 8-bit sound effects — wobble sounds, crack effects, magical burst, celebratory jingle.
Mood: Exciting, mysterious, magical unboxing moment.`;

  const operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    source: { prompt },
    config: {
      aspectRatio: '9:16',
      numberOfVideos: 1,
      durationSeconds: 8,
      resolution: '1080p',
    },
  });

  let result = operation;
  let pollCount = 0;
  while (!result.done) {
    pollCount++;
    console.log(`  Polling hatching video... (${pollCount * 10}s)`);
    await sleep(10000);
    result = await ai.operations.getVideosOperation({ operation: result });
  }

  const videos = result.response?.generatedVideos;
  if (!videos || videos.length === 0) {
    console.error('  No hatching video generated');
    return;
  }

  const outPath = 'public/hatching.mp4';
  await ai.files.download({
    file: videos[0],
    downloadPath: outPath,
  });

  console.log(`  Saved ${outPath}`);
}

// ── Helpers ──────────────────────────────────────────────────────────

async function removeGreenBg(filePath) {
  try {
    const { execSync } = await import('node:child_process');
    execSync(`python3 -c "
from PIL import Image
img = Image.open('${filePath}').convert('RGBA')
data = img.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b, a = data[x, y]
        if g > 180 and r < 100 and b < 100:
            data[x, y] = (0, 0, 0, 0)
img.save('${filePath}')
print('  Green background removed')
"`);
  } catch {
    console.log('  (Skipping green bg removal — Pillow not available)');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Regenerating DiaryBeast Assets ===\n');

  // Run all three in parallel
  await Promise.all([
    generateEgg().catch(e => console.error('Egg generation failed:', e.message)),
    generateEggAnimation().catch(e => console.error('Egg animation failed:', e.message)),
    generateHatchingVideo().catch(e => console.error('Hatching video failed:', e.message)),
  ]);

  console.log('\n=== Done! ===');
}

main();
