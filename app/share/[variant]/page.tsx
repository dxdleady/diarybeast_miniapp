import type { Metadata } from "next";
import { BEAST_VARIANTS, getBeastDisplayName } from "@/lib/beast-data";

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

interface Props {
  params: Promise<{ variant: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { variant } = await params;
  const displayName = getBeastDisplayName(variant);
  const ogUrl = `${ROOT_URL}/api/og/${variant}`;

  return {
    title: `${displayName} — DiaryBeast`,
    description: `Meet ${displayName} on DiaryBeast — your onchain Tamagotchi diary`,
    openGraph: {
      title: `${displayName} — DiaryBeast`,
      description: `Meet ${displayName} on DiaryBeast — your onchain Tamagotchi diary`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: "1",
        imageUrl: ogUrl,
        button: {
          title: "Hatch Your Beast",
          action: {
            name: "Launch DiaryBeast",
            type: "launch_miniapp",
          },
        },
      }),
    },
  };
}

export async function generateStaticParams() {
  return BEAST_VARIANTS.map((v) => ({ variant: v.id }));
}

export default async function ShareVariantPage({ params }: Props) {
  const { variant } = await params;
  const displayName = getBeastDisplayName(variant);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0E1A",
        color: "#A0D8E0",
        fontFamily: "sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", color: "#00E5FF", marginBottom: "1rem" }}>
        {displayName}
      </h1>
      <p style={{ maxWidth: "20rem", lineHeight: 1.6 }}>
        Open in Farcaster to launch DiaryBeast and hatch your own Beast.
      </p>
    </div>
  );
}
