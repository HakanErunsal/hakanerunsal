"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface DocNavLink {
    title: string;
    href: string;
}

interface DocNavProps {
    prev?: DocNavLink;
    next?: DocNavLink;
    className?: string;
}

export function DocNav({ prev, next, className }: DocNavProps) {
    return (
        <nav
            className={cn(
                "flex flex-col sm:flex-row justify-between gap-4 mt-12 pt-6 border-t border-border",
                className
            )}
        >
            {prev ? (
                <Link
                    href={prev.href}
                    className="group flex flex-col items-start p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card/50 transition-all duration-200 flex-1"
                >
                    <span className="text-xs text-muted-foreground mb-1">← Previous</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {prev.title}
                    </span>
                </Link>
            ) : (
                <div className="flex-1" />
            )}

            {next ? (
                <Link
                    href={next.href}
                    className="group flex flex-col items-end p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card/50 transition-all duration-200 flex-1 text-right"
                >
                    <span className="text-xs text-muted-foreground mb-1">Next →</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {next.title}
                    </span>
                </Link>
            ) : (
                <div className="flex-1" />
            )}
        </nav>
    );
}

export default DocNav;
