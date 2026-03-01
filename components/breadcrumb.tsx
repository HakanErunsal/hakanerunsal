"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn(
                "flex items-center gap-1.5 text-xs text-muted-foreground mb-4 py-2 px-0 overflow-x-auto",
                className
            )}
        >
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 whitespace-nowrap">
                    {index > 0 && (
                        <span className="text-muted-foreground/40 select-none">/</span>
                    )}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}

export default Breadcrumb;
