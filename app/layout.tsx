import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/components/site-footer";
import NavigationColumn from "@/components/site-navigation-column";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
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
          inter.variable
        )}
      >
        <Providers>
          <div className="flex flex-col min-h-screen bg-background">
            {/* <SiteHeader/> */}
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
