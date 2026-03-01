import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function GET(req: NextRequest) {
  try {
    const fontBold = readFileSync(join(process.cwd(), "assets/fonts/Inter-Bold.ttf"));

    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title");

    if (!title) {
      return new Response("No title provided", { status: 500 });
    }

    const heading =
      title.length > 140 ? `${title.substring(0, 140)}...` : title;

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-16 w-full h-full"
          style={{
            background: "linear-gradient(145deg, #101318 0%, #161b22 50%, #101318 100%)",
            fontFamily: "Inter",
          }}
        >
          {/* Subtle top glow */}
          <div
            tw="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at top center, rgba(79,168,142,0.15) 0%, transparent 60%)",
            }}
          />

          {/* Header with logo mark */}
          <div tw="flex items-center relative">
            <div
              tw="flex items-center justify-center w-12 h-12 rounded-xl mr-4"
              style={{ background: "rgba(79,168,142,0.12)", border: "1px solid rgba(79,168,142,0.25)" }}
            >
              <span tw="text-3xl font-bold" style={{ color: "#4fa88e" }}>H</span>
            </div>
            <span tw="font-bold text-2xl text-white">{siteConfig.name}</span>
          </div>

          {/* Title */}
          <div tw="flex flex-col flex-1 py-10 relative">
            <div tw="flex text-[56px] font-bold text-white leading-tight">{heading}</div>
          </div>

          {/* Footer */}
          <div
            tw="flex items-center w-full justify-between relative"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}
          >
            <div tw="flex text-lg" style={{ color: "#4fa88e" }}>{siteConfig.url}</div>
            <div tw="flex text-lg" style={{ color: "#555b64" }}>Game Developer &amp; Software Engineer</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontBold,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
