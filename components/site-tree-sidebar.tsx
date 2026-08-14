"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { docs, articles, projects } from "#site/content";
import { SecDocSearch } from "@/components/sec-doc-search";
import { isRigbak } from "@/lib/site-mode";
import { brandConfig } from "@/config/site";

// ──────────────────────────────────────
//  Types
// ──────────────────────────────────────
type Section = "home" | "articles" | "projects" | "docs" | "about";

interface TreeNode {
    title: string;
    slug: string;
    slugAsParams: string;
    children: TreeNode[];
    date?: string;
    image?: string;
}

// ──────────────────────────────────────
//  Build trees for each section
// ──────────────────────────────────────
function buildDocTree(): TreeNode[] {
    const publishedDocs = docs.filter(d => d.published);
    const rootDocs = publishedDocs.filter(d => !d.parent);

    return rootDocs.map(rootDoc => {
        const children = publishedDocs
            .filter(d => d.parent === rootDoc.slugAsParams)
            .sort((a, b) => {
                const ao = a.order ?? Number.MAX_SAFE_INTEGER;
                const bo = b.order ?? Number.MAX_SAFE_INTEGER;
                if (ao !== bo) return ao - bo;
                return a.title.localeCompare(b.title);
            });

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

function buildArticleList(): TreeNode[] {
    return articles
        .filter(a => a.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(a => ({
            title: a.title,
            slug: a.slug,
            slugAsParams: a.slugAsParams,
            date: a.date,
            children: [],
        }));
}

function buildProjectList(): TreeNode[] {
    return projects
        .filter(p => p.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(p => ({
            title: p.title,
            slug: p.slug,
            slugAsParams: p.slugAsParams,
            date: p.date,
            image: p.image?.src,
            children: [],
        }));
}

// ──────────────────────────────────────
//  Detect active section from pathname
// ──────────────────────────────────────
function getSection(pathname: string): Section {
    if (pathname.startsWith("/docs")) return "docs";
    if (pathname.startsWith("/articles")) return "articles";
    if (pathname.startsWith("/projects")) return "projects";
    if (pathname.startsWith("/about")) return "about";
    return "home";
}

function isSecDocsPath(pathname: string): boolean {
    return pathname === "/docs/SoulslikeCombatDocs"
        || pathname.startsWith("/docs/soulslike-combat/");
}

// ──────────────────────────────────────
//  Collapsible tree node (for docs)
// ──────────────────────────────────────
function TreeSection({ node, pathname }: { node: TreeNode; pathname: string }) {
    const isActive = pathname === `/${node.slug}`;
    const hasActiveChild = node.children.some(c => pathname === `/${c.slug}`);
    const holdsOpenPage = isActive || hasActiveChild;

    // A branch holding the open page expands on its own. The toggle overrides that, and the override is dropped
    // whenever navigation moves the open page in or out of this branch, so opening a doc always reveals it.
    // The sidebar sits in the layout and never remounts between docs, so this cannot be an initial state value.
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

// ──────────────────────────────────────
//  Flat list item (for articles/projects)
// ──────────────────────────────────────
function ListItem({ node, pathname }: { node: TreeNode; pathname: string }) {
    const isActive = pathname === `/${node.slug}`;

    return (
        <li>
            <Link
                href={`/${node.slug}`}
                className={cn(
                    "block py-1.5 px-3 text-sm rounded transition-colors duration-150 truncate",
                    isActive
                        ? "text-primary font-medium bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
            >
                {node.title}
            </Link>
        </li>
    );
}

// ──────────────────────────────────────
//  Sidebar section label
// ──────────────────────────────────────
const sectionLabels: Record<Section, string> = {
    home: isRigbak ? "Plugins & Games" : "Welcome",
    articles: "Articles",
    projects: "Projects",
    docs: "Documentation",
    about: "About",
};

// ──────────────────────────────────────
//  Main sidebar component
// ──────────────────────────────────────
export function SiteTreeSidebar() {
    const pathname = usePathname();
    const section = getSection(pathname);

    const docTree = useMemo(() => buildDocTree(), []);
    const articleList = useMemo(() => buildArticleList(), []);
    const projectList = useMemo(() => buildProjectList(), []);

    // The rigbak build carries only what rigbak.com serves. Linking the
    // portfolio sections here would send every click through a cross-host
    // redirect.
    const navLinks: { href: string; label: string; section: Section }[] = isRigbak
        ? [
            { href: "/", label: "Catalogue", section: "home" },
            { href: "/docs", label: "Docs", section: "docs" },
        ]
        : [
            { href: "/articles", label: "Articles", section: "articles" },
            { href: "/projects", label: "Projects", section: "projects" },
            { href: "/docs", label: "Docs", section: "docs" },
            { href: "/about", label: "About", section: "about" },
        ];

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
                        <span className="text-sm font-heading font-semibold text-foreground">
                            {sectionLabels[section]}
                        </span>
                        <span className="text-xs text-muted-foreground">{brandConfig.name}</span>
                    </div>
                </Link>
            </div>

            {/* Quick nav links */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border/50 text-xs">
                {navLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "px-2 py-1 rounded transition-colors",
                            section === link.section
                                ? "text-primary font-medium bg-primary/8"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {section === "docs" && isSecDocsPath(pathname) && (
                <SecDocSearch />
            )}

            {/* Section-specific content */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {section === "docs" && (
                    <ul className="space-y-1">
                        {docTree.map(node => (
                            <TreeSection key={node.slug} node={node} pathname={pathname} />
                        ))}
                    </ul>
                )}

                {section === "articles" && (
                    <ul className="space-y-0.5">
                        {articleList.map(node => (
                            <ListItem key={node.slug} node={node} pathname={pathname} />
                        ))}
                    </ul>
                )}

                {section === "projects" && (
                    <ul className="space-y-0.5">
                        {projectList.map(node => (
                            <ListItem key={node.slug} node={node} pathname={pathname} />
                        ))}
                    </ul>
                )}

                {(section === "home" || section === "about") && (
                    <div className="space-y-6">
                        {/* Quick links to each section */}
                        {!isRigbak && (
                            <>
                                <div>
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                                        Projects
                                    </h3>
                                    <ul className="space-y-0.5">
                                        {projectList.slice(0, 5).map(node => (
                                            <ListItem key={node.slug} node={node} pathname={pathname} />
                                        ))}
                                        {projectList.length > 5 && (
                                            <li>
                                                <Link
                                                    href="/projects"
                                                    className="block py-1.5 px-3 text-xs text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    View all {projectList.length} projects →
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                                        Articles
                                    </h3>
                                    <ul className="space-y-0.5">
                                        {articleList.slice(0, 5).map(node => (
                                            <ListItem key={node.slug} node={node} pathname={pathname} />
                                        ))}
                                        {articleList.length > 5 && (
                                            <li>
                                                <Link
                                                    href="/articles"
                                                    className="block py-1.5 px-3 text-xs text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    View all {articleList.length} articles →
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </>
                        )}
                        <div>
                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                                Documentation
                            </h3>
                            <ul className="space-y-0.5">
                                {docTree.slice(0, 5).map(node => (
                                    <ListItem key={node.slug} node={node} pathname={pathname} />
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </nav>

            {/* Bottom link - context-aware */}
            <div className="px-4 py-3 border-t border-border/50">
                {section === "docs" ? (
                    <Link
                        href="/docs"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        All Documentation
                    </Link>
                ) : section === "articles" ? (
                    <Link
                        href="/articles"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        All Articles
                    </Link>
                ) : section === "projects" ? (
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        All Projects
                    </Link>
                ) : (
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Home
                    </Link>
                )}
            </div>
        </aside>
    );
}

export default SiteTreeSidebar;
