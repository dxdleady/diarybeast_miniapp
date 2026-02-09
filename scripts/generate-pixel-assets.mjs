import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("GOOGLE_API_KEY environment variable required");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const STYLE = `Pixel art, 8-bit Tamagotchi style, thick black 1px outlines, limited color palette, front-facing symmetric pose, large expressive eyes (2x3 px), tiny rounded limbs, chibi proportions (head = 40% of body), soft interior shading with 2-tone per color zone, no anti-aliasing, clean pixel edges, transparent background, PNG export.`;

const PROMPTS = [
  {
    filename: "egg.png",
    prompt: `${STYLE} A magical pixel art egg, centered. Smooth rounded egg shape with soft blue-purple gradient shimmer. Small pixel sparkle particles around it (4-pointed stars). The egg has a tiny crack line starting at the top. Subtle blue glow effect around the egg. On solid flat chromakey green #00FF00 background.`,
  },
  {
    filename: "beast-happy.png",
    prompt: `${STYLE} A cute pixel art orange tabby cat, extremely happy celebrating expression. Eyes squeezed shut in joy, tiny arms raised up, small pixel hearts and sparkle particles floating around it. Orange body (#E8913A) with lighter belly (#F4C46D), green eyes. On solid flat chromakey green #00FF00 background.`,
  },
  {
    filename: "beast-icon.png",
    prompt: `${STYLE} A cute pixel art orange tabby cat face only, simplified for small icon use. Large expressive green eyes, cute whiskers, orange fur (#E8913A). Must be clear and readable at small sizes. On solid flat chromakey green #00FF00 background.`,
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
  console.log(`Generating ${PROMPTS.length} pixel art assets...\n`);

  for (const p of PROMPTS) {
    try {
      await generateImage(p.prompt, p.filename);
    } catch (err) {
      console.error(`  FAILED: ${p.filename} — ${err.message}`);
    }
  }

  console.log("\nDone!");
}

main();
