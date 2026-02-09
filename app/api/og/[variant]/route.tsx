import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { BEAST_VARIANTS, getBeastDisplayName } from "@/lib/beast-data";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ variant: string }> }
) {
  const { variant } = await params;

  // Validate variant exists
  const beast = BEAST_VARIANTS.find((v) => v.id === variant);
  if (!beast) {
    return new Response("Unknown variant", { status: 404 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "http://localhost:3000";

  const beastImageUrl = `${baseUrl}${beast.image}`;
  const iconUrl = `${baseUrl}/icon.png`;
  const displayName = getBeastDisplayName(variant);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0E1A",
          fontFamily: "sans-serif",
        }}
      >
        {/* Beast sprite */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beastImageUrl}
          alt={displayName}
          width={200}
          height={200}
          style={{ imageRendering: "pixelated", marginBottom: 24 }}
        />

        {/* Logo + title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconUrl} alt="DiaryBeast" width={40} height={40} />
          <span style={{ fontSize: 42, fontWeight: 700, color: "#00E5FF" }}>
            DiaryBeast
          </span>
        </div>

        {/* Beast name */}
        <span style={{ fontSize: 28, color: "#FFFFFF", marginBottom: 8 }}>
          {displayName}
        </span>

        {/* Tagline */}
        <span style={{ fontSize: 20, color: "#A0D8E0" }}>
          Your onchain Tamagotchi diary
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
