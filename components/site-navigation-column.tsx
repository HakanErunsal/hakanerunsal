import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

export function NavigationColumn() {
  return (
    <div className="sticky grid top-0">
      {/* Logo */}
      <div className="col-span-1 flex w-32">
        <Link href="/">
          <img src="/images/logos/H_Logo.png" alt="Logo" className="m-4" />
          <img
            src="/images/logos/Hakan_Logo.png"
            alt="Logo"
            className="w-fit ml-4"
          />
        </Link>
      </div>

      {/* Navigation Buttons */}
      <div className="col-start-2 col-span-2 mt-12">
        <ul>
          <li>
            <Link
              href="/articles"
              className={cn(
                buttonVariants({ variant: "link", size: "lg" }),
                "text-4xl"
              )}
            >
              Articles
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={cn(
                buttonVariants({ variant: "link", size: "lg" }),
                "text-4xl"
              )}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "link", size: "lg" }),
                "text-4xl"
              )}
            >
              <Icons.gitHub className="h-12 w-12 mr-2" /> GitHub
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavigationColumn;
