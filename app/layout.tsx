import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/components/site-footer";
import NavigationColumn from "@/components/site-navigation-column";

const rubik = Rubik({ 
  subsets: ["latin"], 
  variable: "--font-sans", 
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Game Developer", "Unreal Engine", "Mobile Games", "C++", "Software Engineer", "Game Development", "Portfolio"],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
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
          rubik.variable
        )}
      >
        <Providers>
          <div className="flex flex-col min-h-screen bg-background">
            <div className="flex flex-col flex-grow">
              <NavigationColumn />
              <main className="flex-grow">{children}</main>
            </div>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
