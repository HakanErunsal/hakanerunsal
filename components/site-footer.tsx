import { siteConfig } from "@/config/site";
import { Mail } from "lucide-react";
import { Icons } from "./icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-ue-sidebar">
      <div className="py-8 flex flex-col items-center gap-4">
        <div className="flex space-x-4">
          <a href="mailto:hakanerunsal2@gmail.com" className="cursor-pointer text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">Mail</span>
            <Mail className="h-5 w-5" />
          </a>
          <a target="_blank" rel="noreferrer" href={siteConfig.links.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">LinkedIn</span>
            <Icons.linkedin className="h-5 w-5" />
          </a>
          <a target="_blank" rel="noreferrer" href={siteConfig.links.twitter} className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">Twitter</span>
            <Icons.twitter className="h-5 w-5" />
          </a>
          <a target="_blank" rel="noreferrer" href={siteConfig.links.github} className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">GitHub</span>
            <Icons.gitHub className="h-5 w-5" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.author}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}