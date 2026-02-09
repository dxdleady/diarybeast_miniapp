#!/usr/bin/env node
/**
 * Generate branding assets from logo-diarybeast.png (or beast-icon.png fallback).
 * Outputs: icon.png (200x200), splash.png (200x200), logo.png (200x200), hero.png (1200x630)
 *
 * Usage: node scripts/generate-branding.mjs
 */

import sharp from "sharp";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const BG_COLOR = { r: 10, g: 14, b: 26, alpha: 1 }; // #0A0E1A

// Find source logo
const logoPrimary = join(publicDir, "logo-diarybeast.png");
const logoFallback = join(publicDir, "beast-icon.png");
const logoSrc = existsSync(logoPrimary) ? logoPrimary : logoFallback;

console.log(`Using source: ${logoSrc}`);

async function generateSquare(outputName, size) {
  const logoSize = Math.round(size * 0.7);
  const offset = Math.round((size - logoSize) / 2);

  const logo = await sharp(logoSrc)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BG_COLOR },
  })
    .composite([{ input: logo, left: offset, top: offset }])
    .png()
    .toFile(join(publicDir, outputName));

  console.log(`  ${outputName} (${size}x${size})`);
}

async function generateHero() {
  const width = 1200;
  const height = 630;
  const logoSize = 300;
  const logoX = Math.round((width - logoSize) / 2);
  const logoY = 60;

  const logo = await sharp(logoSrc)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create text SVG for title + tagline
  const textSvg = Buffer.from(`
    <svg width="${width}" height="${height}">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;400');
        .title { fill: #00E5FF; font-size: 56px; font-weight: 700; font-family: 'Inter', sans-serif; }
        .tagline { fill: #A0D8E0; font-size: 24px; font-weight: 400; font-family: 'Inter', sans-serif; }
      </style>
      <text x="${width / 2}" y="${logoY + logoSize + 70}" text-anchor="middle" class="title">DiaryBeast</text>
      <text x="${width / 2}" y="${logoY + logoSize + 110}" text-anchor="middle" class="tagline">Your onchain Tamagotchi diary</text>
    </svg>
  `);

  await sharp({
    create: { width, height, channels: 4, background: BG_COLOR },
  })
    .composite([
      { input: logo, left: logoX, top: logoY },
      { input: textSvg, left: 0, top: 0 },
    ])
    .png()
    .toFile(join(publicDir, "hero.png"));

  console.log(`  hero.png (${width}x${height})`);
}

async function main() {
  console.log("Generating branding assets...");

  await Promise.all([
    generateSquare("icon.png", 200),
    generateSquare("splash.png", 200),
    generateSquare("logo.png", 200),
    generateHero(),
  ]);

  console.log("Done!");
}

main().catch(console.error);
