"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MiniSearch from "minisearch";
import { Search, X } from "lucide-react";
import secSearchIndex from "#site/sec-search-index";
import type { SecSearchIndexEntry } from "@/lib/build-sec-search-index";
import { cn } from "@/lib/utils";

interface SecDocSearchProps {
  className?: string;
}

interface SearchHit extends SecSearchIndexEntry {
  score: number;
}

function createSearchEngine(): MiniSearch<SecSearchIndexEntry> {
  const engine = new MiniSearch<SecSearchIndexEntry>({
    fields: ["title", "section", "description", "keywords", "content"],
    storeFields: ["title", "href", "description", "section"],
    searchOptions: {
      boost: {
        title: 4,
        section: 3,
        keywords: 2.5,
        description: 1.5,
        content: 1,
      },
      fuzzy: 0.15,
      prefix: true,
    },
  });

  engine.addAll(secSearchIndex.documents);
  return engine;
}

export function SecDocSearch({ className }: SecDocSearchProps) {
  const engine = useMemo(() => createSearchEngine(), []);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo<SearchHit[]>(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return [];
    }

    return engine
      .search(trimmed, { combineWith: "AND" })
      .slice(0, 8)
      .flatMap((hit) => {
        const entry = secSearchIndex.documents.find((doc) => doc.id === hit.id);
        if (!entry) {
          return [];
        }

        return [{ ...entry, score: hit.score }];
      });
  }, [engine, query]);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        closeSearch();
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const activeItem = listRef.current.querySelector('[data-active="true"]');
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results.length]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, results.length - 1));
      setIsOpen(true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      setIsOpen(true);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = results[activeIndex];
      if (hit) {
        window.location.href = hit.href;
      }
    }
  };

  return (
    <div className={cn("relative px-3 pb-3 border-b border-border/50", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(closeSearch, 150);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Search SEC docs…"
          aria-label="Search Soulslike Enemy Combat documentation"
          aria-expanded={isOpen && results.length > 0}
          aria-controls="sec-doc-search-results"
          className="w-full rounded-md border border-border/60 bg-background/80 py-2 pl-8 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
        <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query ? (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="pointer-events-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden rounded border border-border/70 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
              Ctrl K
            </kbd>
          )}
        </div>
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-3 right-3 top-[calc(100%-4px)] z-50 mt-1 overflow-hidden rounded-md border border-border/70 bg-popover shadow-lg">
          {results.length > 0 ? (
            <ul
              id="sec-doc-search-results"
              ref={listRef}
              className="max-h-72 overflow-y-auto py-1"
            >
              {results.map((hit, index) => {
                const isActive = index === activeIndex;
                return (
                <li key={hit.id}>
                  <Link
                    href={hit.href}
                    data-active={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "block px-3 py-2 transition-colors",
                      isActive
                        ? "bg-primary/15 text-foreground ring-1 ring-inset ring-primary/20"
                        : "text-foreground/80 hover:bg-accent/70 hover:text-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "truncate text-sm",
                        isActive ? "font-semibold text-foreground" : "font-medium",
                      )}
                    >
                      {hit.section || hit.title}
                    </div>
                    <div
                      className={cn(
                        "truncate text-xs",
                        isActive ? "text-foreground/75" : "text-muted-foreground",
                      )}
                    >
                      {hit.section ? hit.title : hit.description}
                    </div>
                  </Link>
                </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              No matches for &ldquo;{query.trim()}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SecDocSearch;
