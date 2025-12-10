"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface DocsSidebarProps {
    className?: string;
}

export function DocsSidebar({ className }: DocsSidebarProps) {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Get all h2 and h3 headings from the article
        const article = document.querySelector("article");
        if (!article) return;

        const elements = article.querySelectorAll("h2, h3");
        const items: TocItem[] = [];

        elements.forEach((element) => {
            const id = element.id;
            if (id && id !== "table-of-contents") {
                items.push({
                    id,
                    text: element.textContent || "",
                    level: element.tagName === "H2" ? 2 : 3,
                });
            }
        });

        setHeadings(items);

        // Set up intersection observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-100px 0px -80% 0px",
                threshold: 0,
            }
        );

        elements.forEach((element) => {
            if (element.id) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    // Auto-scroll sidebar to keep active item visible
    useEffect(() => {
        if (!activeId) return;

        const activeElement = document.querySelector(`nav a[href="#${activeId}"]`);
        const sidebar = document.querySelector('nav.overflow-y-auto');

        if (activeElement && sidebar) {
            const sidebarRect = sidebar.getBoundingClientRect();
            const activeRect = activeElement.getBoundingClientRect();

            // Check if active item is outside visible area of sidebar
            if (activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeId]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            setActiveId(id);
            // Update URL without scroll
            window.history.pushState(null, "", `#${id}`);
        }
    };

    if (headings.length === 0) return null;

    // Check if next item is a child (H3) of current item
    const hasChildren = (index: number) => {
        return index < headings.length - 1 && headings[index + 1].level === 3;
    };

    // Check if current H3 is the last child before next H2 or end
    const isLastChild = (index: number) => {
        if (headings[index].level !== 3) return false;
        return index === headings.length - 1 || headings[index + 1].level === 2;
    };

    return (
        <nav
            className={cn(
                "hidden lg:block fixed left-0 top-80 w-72 h-[calc(100vh-22rem)] overflow-y-auto",
                "border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                "px-5 py-4 z-20",
                className
            )}
        >
            <div className="mb-4">
                <h4 className="text-base font-semibold text-foreground">On This Page</h4>
            </div>
            <ul className="space-y-0.5">
                {headings.map((heading, index) => (
                    <li
                        key={heading.id}
                        className="relative"
                    >
                        {/* Tree connector lines for H3 items */}
                        {heading.level === 3 && (
                            <>
                                {/* Vertical line from parent */}
                                <span
                                    className={cn(
                                        "absolute left-3 w-px bg-border",
                                        isLastChild(index) ? "top-0 h-4" : "top-0 bottom-0"
                                    )}
                                />
                                {/* Horizontal line to item */}
                                <span className="absolute left-3 top-4 w-3 h-px bg-border" />
                            </>
                        )}
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(e, heading.id)}
                            className={cn(
                                "block py-1.5 rounded-md transition-colors duration-200 leading-snug",
                                "hover:bg-accent hover:text-accent-foreground",
                                heading.level === 2
                                    ? "text-sm text-foreground/90 px-3"
                                    : "text-sm text-foreground/60 pl-8 pr-3",
                                activeId === heading.id && "bg-accent text-foreground font-medium border-l-2 border-primary"
                            )}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>            {/* Back to top button */}
            <div className="mt-6 pt-4 border-t border-border/40">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 px-3"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m18 15-6-6-6 6" />
                    </svg>
                    Back to top
                </button>
            </div>
        </nav>
    );
}

export default DocsSidebar;
