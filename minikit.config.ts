const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    ownerAddress: "",
  },
  miniapp: {
    version: "1",
    name: "DiaryBeast",
    subtitle: "Your onchain Tamagotchi diary",
    description:
      "Hatch your Beast, name it, choose your path, and grow onchain. A journaling companion that evolves with you.",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0F172A",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "lifestyle",
    tags: ["journaling", "tamagotchi", "pet", "wellness"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Hatch your Beast. Grow onchain.",
    ogTitle: "DiaryBeast — Your Onchain Tamagotchi Diary",
    ogDescription:
      "Hatch a unique Beast, name it, and start your journaling journey onchain.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
