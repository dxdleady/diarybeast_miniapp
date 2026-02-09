import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("GOOGLE_API_KEY environment variable required");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const STYLE_SUFFIX = `Style: kawaii digital illustration, soft rounded shapes, Tamagotchi meets modern mobile game character. Simple body, big expressive eyes, small limbs. Colors: soft pastel with iridescent/holographic accents. Background: solid dark (#0F172A). No text. High quality, clean edges, suitable for mobile app UI.`;

const PROMPTS = [
  {
    filename: "egg.png",
    prompt: `A single magical egg with smooth pearlescent surface and subtle blue-purple iridescent shimmer. Small sparkle particles float around it. Soft blue glow (#0052FF). Dark background (#0F172A). Game UI asset style. ${STYLE_SUFFIX}`,
  },
  {
    filename: "beast-default.png",
    prompt: `A cute kawaii creature character for a mobile game. Simple rounded body shape like a small blob or bean. Soft lavender-blue pastel color with subtle holographic shimmer. Big expressive happy eyes, tiny arms and feet. Small cute detail: a tiny star-shaped mark on forehead. Front-facing, centered. Dark background (#0F172A). ${STYLE_SUFFIX}`,
  },
  {
    filename: "beast-warm.png",
    prompt: `A cute kawaii creature character, same blob-bean shape as reference. Change color palette to warm: soft coral-peach body with golden accents. Eyes: warm amber color. Big expressive happy eyes, tiny arms and feet. Small cute detail: a tiny star-shaped mark on forehead. Front-facing, centered. Dark background (#0F172A). ${STYLE_SUFFIX}`,
  },
  {
    filename: "beast-cool.png",
    prompt: `A cute kawaii creature character, same blob-bean shape. Change color palette to cool: soft mint-teal body with silver accents. Eyes: deep blue-green. Big expressive happy eyes, tiny arms and feet. Small cute detail: a tiny star-shaped mark on forehead. Front-facing, centered. Dark background (#0F172A). ${STYLE_SUFFIX}`,
  },
  {
    filename: "beast-dark.png",
    prompt: `A cute kawaii creature character, same blob-bean shape. Change color palette to dramatic: deep purple body with electric blue accents. Eyes: bright violet. Slightly more mystical look. Big expressive eyes, tiny arms and feet. Small cute detail: a tiny star-shaped mark on forehead. Front-facing, centered. Dark background (#0F172A). ${STYLE_SUFFIX}`,
  },
  {
    filename: "beast-happy.png",
    prompt: `A cute kawaii creature character, soft lavender-blue pastel color blob-bean shape. Now showing extremely happy, celebrating expression. Eyes closed in joy, tiny arms raised up. Small confetti and sparkle particles around. Dark background (#0F172A). ${STYLE_SUFFIX}`,
  },
  {
    filename: "beast-icon.png",
    prompt: `A cute kawaii creature character, simplified version for small icon use. Centered face only of a soft lavender-blue pastel blob creature, big eyes, simple shape. Must be readable at small sizes. Dark background (#0F172A). ${STYLE_SUFFIX}`,
  },
];

async function generateImage(prompt, filename) {
  console.log(`Generating ${filename}...`);

  const response = await ai.models.generateContent({
    model: "nano-banana-pro-preview",
    contents: prompt,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error(`No response for ${filename}`);

  const imagePart = parts.find((p) =>
    p.inlineData?.mimeType?.startsWith("image/")
  );
  if (!imagePart?.inlineData?.data) {
    throw new Error(`No image data for ${filename}`);
  }

  const outputPath = `public/${filename}`;
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`  Saved ${outputPath}`);
}

async function main() {
  console.log(`Generating ${PROMPTS.length} assets...\n`);

  for (const p of PROMPTS) {
    try {
      await generateImage(p.prompt, p.filename);
    } catch (err) {
      console.error(`  FAILED: ${p.filename} — ${err.message}`);
    }
  }

  // Copy hatching video from sprite generator output
  console.log("\nDone! Don't forget to copy hatching.mp4 from diarybeast_miniapp/public/sprites/miniapp/");
}

main();
