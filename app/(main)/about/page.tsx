import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { Icons } from "@/components/icons";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About Me",
  description: "Information about me",
};

export default async function AboutPage() {
  return (
    <div className="container max-w-6xl py-6 lg:py-10 mt-80">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-x-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl">
            About Me
          </h1>
        </div>
      </div>
      <hr className="my-8" />
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="min-w-48 max-w-48 flex flex-col gap-2">
          <Avatar className="h-48 w-48 border-4 border-primary bg-background p-1">
            <AvatarImage src="/logos/H_Logo.png" alt={siteConfig.author} className="object-contain scale-110" />
            <AvatarFallback>HE</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-center break-words">
            {siteConfig.author}
          </h2>
          <p className="text-muted-foreground text-center break-words">
          Software Engineer & Game Developer
          </p>
          <div className="flex justify-center space-x-3 mt-4">
            <a href="mailto:hakanerunsal2@gmail.com" className="cursor-pointer hover:text-primary transition-colors">
              <span className="sr-only">Mail</span>
              <Mail className="h-5 w-5" />
            </a>
            <a target="_blank" rel="noreferrer" href={siteConfig.links.linkedin} className="hover:text-primary transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Icons.linkedin className="h-5 w-5" />
            </a>
            <a target="_blank" rel="noreferrer" href={siteConfig.links.twitter} className="hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <Icons.twitter className="h-5 w-5" />
            </a>
            <a target="_blank" rel="noreferrer" href={siteConfig.links.github} className="hover:text-primary transition-colors">
              <span className="sr-only">GitHub</span>
              <Icons.gitHub className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="text-container">
          <p className="text-muted-foreground text-lg py-4">
              I am an enthusiastic game developer, interested in every field of game development and open to learning more. I have made a bunch of successful mobile shooter games.
          </p>

          <p className="text-muted-foreground text-lg py-4">
              Coding Languages: C++, Unreal Blueprint, C#
          </p>

          <p className="text-muted-foreground text-lg py-4">
              Game Engines: Unreal Engine (8 years), Unity (2 years)
          </p>

          <div className="py-4">
            <h3 className="text-xl font-bold mb-3">Connect</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:hakanerunsal2@gmail.com" className="hover:text-primary transition-colors underline">hakanerunsal2@gmail.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong>LinkedIn:</strong> <a href={siteConfig.links.linkedin} className="hover:text-primary transition-colors underline" target="_blank" rel="noreferrer">linkedin.com/in/hakandev</a>
              </p>
              <p className="text-muted-foreground">
                <strong>GitHub:</strong> <a href={siteConfig.links.github} className="hover:text-primary transition-colors underline" target="_blank" rel="noreferrer">github.com/hakanerunsal</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Twitter:</strong> <a href={siteConfig.links.twitter} className="hover:text-primary transition-colors underline" target="_blank" rel="noreferrer">@Hakan_Erunsal</a>
              </p>
            </div>
          </div>
          
      </div>

      </div>
    </div>
  );
}
