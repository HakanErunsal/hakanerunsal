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
                "flex flex-col sm:flex-row justify-between gap-4 mt-12 pt-6 border-t border-border/50",
                className
            )}
        >
            {prev ? (
                <Link
                    href={prev.href}
                    className="group flex flex-col items-start p-4 border border-border/50 hover:border-primary/40 hover:bg-accent/50 transition-all duration-200 flex-1 rounded-sm"
                >
                    <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary transition-colors"><path d="m15 18-6-6 6-6" /></svg>
                        Previous
                    </span>
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
                    className="group flex flex-col items-end p-4 border border-border/50 hover:border-primary/40 hover:bg-accent/50 transition-all duration-200 flex-1 text-right rounded-sm"
                >
                    <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary transition-colors"><path d="m9 18 6-6-6-6" /></svg>
                    </span>
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
