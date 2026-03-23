"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function DocsPageTOC() {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
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

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            setActiveId(id);
            window.history.pushState(null, "", `#${id}`);
        }
    };

    if (headings.length === 0) return null;

    return (
        <nav className="hidden xl:block w-52 flex-shrink-0 pt-24">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {/* ON THIS PAGE header - matches UE docs */}
                <div className="mb-3">
                    <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                        On This Page
                    </h4>
                </div>

                <ul className="space-y-0.5 border-l border-border/50">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => handleClick(e, heading.id)}
                                className={cn(
                                    "block py-1 text-sm transition-colors duration-150 border-l-2 -ml-px",
                                    heading.level === 2 ? "pl-3" : "pl-6",
                                    activeId === heading.id
                                        ? "border-l-primary text-foreground font-medium"
                                        : "border-l-transparent text-muted-foreground hover:text-foreground hover:border-l-border"
                                )}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Back to top */}
                <div className="mt-6 pt-3 border-t border-border/40">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
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
            </div>
        </nav>
    );
}

export default DocsPageTOC;
