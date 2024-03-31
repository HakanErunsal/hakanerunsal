import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

export function NavigationColumn() {
    return (
        <div className="grid grid-cols-3 p-8">
            {/* Logo */}
            <div className="col-span-1 absolute flex">
                <Link href="/">
                    <img src="/images/logos/H_Logo.png" alt="Logo" className="w-20 h-20 m:4" />
                    <img src="/images/logos/Hakan_Logo.png" alt="Logo" className="w-fit h-6 relative top-1 mt:8" />
                </Link>
            </div>

            {/* Navigation Buttons */}
            <div className="col-start-2 col-span-2 relative left-20 gap-y-48">
                <div>
                    <Link href="/articles" className={cn(buttonVariants({ variant: "link", size: "lg" }), "text-4xl")}>
                        Articles
                    </Link>
                </div>
                <div>
                    <Link href="/projects" className={cn(buttonVariants({ variant: "link", size: "lg" }), "text-4xl")}>
                        Projects
                    </Link>
                </div>
                <div>
                    <Link href={siteConfig.links.github} target="_blank" rel="noreferrer"
                        className={cn(buttonVariants({ variant: "link", size: "lg" }), "text-4xl")}
                    >
                        <Icons.gitHub className="h-12 w-12 mr-2"/> GitHub
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NavigationColumn;
