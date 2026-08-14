import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { brandConfig, siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: brandConfig.name,
    template: `%s | ${brandConfig.name}`,
  },
  description: brandConfig.description,
  keywords: ["Game Developer", "Unreal Engine", "Mobile Games", "C++", "Software Engineer", "Game Development", "Portfolio"],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? brandConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brandConfig.url,
    title: brandConfig.name,
    description: brandConfig.description,
    siteName: brandConfig.name,
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: brandConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brandConfig.name,
    description: brandConfig.description,
    images: ["/og-card.png"],
    creator: "@Hakan_Erunsal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-pt-[3.5rem]">
      <body
        className={cn(
          "bg-background font-sans antialiased z-10",
          inter.variable,
          interTight.variable
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
