import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

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
          <Avatar className="h-48 w-48">
            <AvatarImage src="/images/AdaletNamluda2.png" alt={siteConfig.author} />
            <AvatarFallback>HE</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-center break-words">
            {siteConfig.author}
          </h2>
          <p className="text-muted-foreground text-center break-words">
          Software Engineer & Game Developer
          </p>
        </div>
        <div class="text-container">
          <p class="text-muted-foreground text-lg py-4">
              I am an enthusiastic game developer, interested in every field of game development and open to learning more. I have made a bunch of successful mobile shooter games.
          </p>

          <p class="text-muted-foreground text-lg py-4">
              Coding Languages: C++, Unreal Blueprint, C#
          </p>

          <p class="text-muted-foreground text-lg py-4">
              Game Engines: Unreal Engine (6 years), Unity (2 years)
          </p>
          
      </div>

      </div>
    </div>
  );
}
