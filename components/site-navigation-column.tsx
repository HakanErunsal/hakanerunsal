import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

export function NavigationColumn() {
    return (
        <div className="container flex flex-row justify-start items-start mt-10 relative">
            {/* Logo */}
            <div>
                <Link href="/">
                    <img src="/images/logos/H_Logo.png" alt="Logo" className="w-20 h-20 m:4" />
                    <img src="/images/logos/Hakan_Logo.png" alt="Logo" className="w-fit h-6 relative top-1 mt:8" />
                </Link>
            </div>

            {/* Navigation Buttons */}
            <div className="relative left-20 flex flex-col gap-2">
                <div>
                    <Link href="/articles" className={cn(buttonVariants({ variant: "link", size: "lg" }), "w-full text-lg")}>
                        Articles
                    </Link>
                </div>
                <div>
                    <Link href="/projects" className={cn(buttonVariants({ variant: "link", size: "lg" }), "w-full text-lg")}>
                        Projects
                    </Link>
                </div>
                <div>
                    <Link href={siteConfig.links.github} target="_blank" rel="noreferrer"
                        className={cn(buttonVariants({ variant: "link", size: "lg" }), "w-full sm:w-fit text-lg")}
                    >
                        <Icons.gitHub className="h-5 w-5 mr-2"/> GitHub
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NavigationColumn;
