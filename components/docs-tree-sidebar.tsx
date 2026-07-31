"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { docs } from "#site/content";

interface DocTreeNode {
    title: string;
    slug: string;
    slugAsParams: string;
    children: DocTreeNode[];
}

function buildDocTree(): DocTreeNode[] {
    const publishedDocs = docs.filter(d => d.published);

    // Root docs (no parent)
    const rootDocs = publishedDocs.filter(d => !d.parent);

    // Build tree
    return rootDocs.map(rootDoc => {
        const children = publishedDocs
            .filter(d => d.parent === rootDoc.slugAsParams)
            .sort((a, b) => a.title.localeCompare(b.title));

        return {
            title: rootDoc.title,
            slug: rootDoc.slug,
            slugAsParams: rootDoc.slugAsParams,
            children: children.map(child => ({
                title: child.title,
                slug: child.slug,
                slugAsParams: child.slugAsParams,
                children: [],
            })),
        };
    });
}

function TreeSection({ node, pathname }: { node: DocTreeNode; pathname: string }) {
    const isActive = pathname === `/${node.slug}`;
    const hasActiveChild = node.children.some(c => pathname === `/${c.slug}`);
    const holdsOpenPage = isActive || hasActiveChild;

    // Same reason as the site sidebar: this component does not remount between docs, so the expansion has to be
    // derived from the path rather than seeded once. The toggle overrides it until navigation moves the open page.
    const [override, setOverride] = useState<boolean | null>(null);
    const [lastHeldOpenPage, setLastHeldOpenPage] = useState(holdsOpenPage);

    if (lastHeldOpenPage !== holdsOpenPage) {
        setLastHeldOpenPage(holdsOpenPage);
        setOverride(null);
    }

    const isExpanded = override ?? holdsOpenPage;
    const setIsExpanded = (next: boolean) => setOverride(next);

    const hasChildren = node.children.length > 0;

    return (
        <li>
            <div className="flex items-center">
                {hasChildren && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors mr-1"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
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
                            className={cn(
                                "transition-transform duration-200",
                                isExpanded ? "rotate-90" : ""
                            )}
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                )}
                {!hasChildren && <span className="w-6 flex-shrink-0" />}
                <Link
                    href={`/${node.slug}`}
                    className={cn(
                        "block py-1.5 px-2 text-sm rounded transition-colors duration-150 truncate flex-1",
                        isActive
                            ? "text-primary font-medium bg-primary/8"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                >
                    {node.title}
                </Link>
            </div>

            {hasChildren && isExpanded && (
                <ul className="ml-3 border-l border-border/50 pl-2 mt-0.5 space-y-0.5">
                    {node.children.map(child => {
                        const childActive = pathname === `/${child.slug}`;
                        return (
                            <li key={child.slug}>
                                <Link
                                    href={`/${child.slug}`}
                                    className={cn(
                                        "block py-1 px-2 text-sm rounded transition-colors duration-150 truncate",
                                        childActive
                                            ? "text-primary font-medium bg-primary/8"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    {child.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
}

export function DocsTreeSidebar() {
    const pathname = usePathname();
    const docTree = buildDocTree();

    return (
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 w-72 h-screen bg-ue-sidebar border-r border-border/50 z-30">
            {/* Logo + site identity */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center overflow-hidden">
                        <Image
                            src="/logos/H_Logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-heading font-semibold text-foreground">Documentation</span>
                        <span className="text-xs text-muted-foreground">Hakan Erunsal</span>
                    </div>
                </Link>
            </div>

            {/* Quick nav links */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border/50 text-xs">
                <Link href="/articles" className="px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    Articles
                </Link>
                <Link href="/projects" className="px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    Projects
                </Link>
                <Link href="/docs" className="px-2 py-1 rounded text-primary font-medium bg-primary/8">
                    Docs
                </Link>
                <Link href="/about" className="px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    About
                </Link>
            </div>

            {/* Doc tree */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {docTree.map(node => (
                        <TreeSection key={node.slug} node={node} pathname={pathname} />
                    ))}
                </ul>
            </nav>

            {/* Back to docs index */}
            <div className="px-4 py-3 border-t border-border/50">
                <Link
                    href="/docs"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    All Documentation
                </Link>
            </div>
        </aside>
    );
}

export default DocsTreeSidebar;
