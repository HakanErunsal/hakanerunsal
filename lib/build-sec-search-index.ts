import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import {
  SEC_DOC_SEARCH_KEYWORDS,
  SEC_GLOBAL_SEARCH_KEYWORDS,
} from "@/config/sec-doc-search-keywords";
import { collapsibleSlug } from "@/lib/collapsible-slug";

export interface SecSearchIndexEntry {
  id: string;
  title: string;
  href: string;
  description: string;
  section: string;
  keywords: string;
  content: string;
}

export interface SecSearchIndex {
  version: 1;
  generatedAt: string;
  documents: SecSearchIndexEntry[];
}

interface VeliteDocMeta {
  slug: string;
  slugAsParams: string;
  title: string;
  description?: string;
  published: boolean;
  parent?: string;
  tags?: string[];
}

interface ParsedHeading {
  level: number;
  title: string;
  id: string;
  /** Raw markdown between this heading and the next heading (any level). */
  body: string;
}

interface ParsedCollapsible {
  title: string;
  id: string;
  /** Raw markdown between the opening and closing Collapsible tags. */
  body: string;
}

interface ParsedQuickStart {
  title: string;
  id: string;
  /** Raw markdown between the opening and closing QuickStart tags. */
  body: string;
}

const QUICK_START_DEFAULT_TITLE = "Set it up";
const QUICK_START_DEFAULT_ID = "set-it-up";

/** Reads an attribute off a JSX opening tag's attribute string. */
function readAttr(attrs: string, name: string): string {
  const match = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1].trim() : "";
}

/**
 * Unwraps the quick-start recipe so its steps survive to the plain-text passes.
 * The recipe is the page's primary instruction, and the generic JSX strip below
 * would otherwise drop it along with the diagrams.
 */
function unwrapQuickStart(text: string): string {
  return text
    .replace(/<QuickStep\b([^>]*)>/g, (_full, attrs: string) => ` ${readAttr(attrs, "title")} `)
    .replace(/<\/QuickStep>/g, " ")
    .replace(/<QuickStart\b([^>]*)>/g, (_full, attrs: string) => ` ${readAttr(attrs, "title")} `)
    .replace(/<\/QuickStart>/g, " ");
}

const SEC_ROOT_SLUG = "SoulslikeCombatDocs";
const SEC_CHILD_PREFIX = "soulslike-combat/";

function isSecDoc(doc: VeliteDocMeta): boolean {
  if (!doc.published) {
    return false;
  }
  return (
    doc.slugAsParams === SEC_ROOT_SLUG ||
    doc.slugAsParams.startsWith(SEC_CHILD_PREFIX) ||
    doc.parent === SEC_ROOT_SLUG
  );
}

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\s*\n?/, "");
}

/** Pull plain text from MDX for indexing. */
export function stripMdxToPlainText(raw: string): string {
  let text = unwrapQuickStart(stripFrontmatter(raw));

  // Drop fenced code blocks (keep inline identifiers out of big blobs).
  text = text.replace(/```[\s\S]*?```/g, " ");

  // Drop JSX/HTML blocks and self-closing components.
  text = text.replace(/<[A-Z][^>]*\/>/g, " ");
  text = text.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]+>/g, " ");
  text = text.replace(/<[^>]+>/g, " ");

  // Markdown links: keep label text.
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // Inline code and emphasis markers.
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/[*_~>#|]/g, " ");

  return text.replace(/\s+/g, " ").trim();
}

export function extractHeadings(raw: string): ParsedHeading[] {
  const text = stripFrontmatter(raw);
  const slugger = new GithubSlugger();
  const matches = Array.from(text.matchAll(/^(#{2,3})\s+(.+)$/gm));
  const headings: ParsedHeading[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const level = match[1].length;
    const title = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .trim();

    if (!title) {
      continue;
    }

    const bodyStart = match.index + match[0].length;
    const bodyEnd = matches[i + 1]?.index ?? text.length;

    headings.push({
      level,
      title,
      id: slugger.slug(title),
      body: text.slice(bodyStart, bodyEnd),
    });
  }

  return headings;
}

/** Reads title="..." off a Collapsible opening tag's attribute string. */
function readCollapsibleTitle(attrs: string): string {
  return readAttr(attrs, "title");
}

/** Finds the `<QuickStart>` recipe on a page, so search can land straight on it. */
export function extractQuickStart(raw: string): ParsedQuickStart | null {
  const text = stripFrontmatter(raw);
  const match = text.match(/<QuickStart\b([^>]*)>([\s\S]*?)<\/QuickStart>/);
  if (!match) {
    return null;
  }

  return {
    title: readAttr(match[1], "title") || QUICK_START_DEFAULT_TITLE,
    id: readAttr(match[1], "id") || QUICK_START_DEFAULT_ID,
    body: match[2],
  };
}

/** Finds every `<Collapsible title="...">...</Collapsible>` block in the page. */
export function extractCollapsibles(raw: string): ParsedCollapsible[] {
  const text = stripFrontmatter(raw);
  const collapsibles: ParsedCollapsible[] = [];

  for (const match of Array.from(
    text.matchAll(/<Collapsible\b([^>]*)>([\s\S]*?)<\/Collapsible>/g),
  )) {
    const title = readCollapsibleTitle(match[1]);
    if (!title) {
      continue;
    }

    collapsibles.push({
      title,
      id: collapsibleSlug(title),
      body: match[2],
    });
  }

  return collapsibles;
}

function readMdxSource(contentRoot: string, slug: string): string {
  const filePath = path.join(contentRoot, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function collectKeywords(doc: VeliteDocMeta): string[] {
  const pageKeywords = SEC_DOC_SEARCH_KEYWORDS[doc.slugAsParams] ?? [];
  const tagKeywords = doc.tags ?? [];
  return [...SEC_GLOBAL_SEARCH_KEYWORDS, ...pageKeywords, ...tagKeywords];
}

function snippet(text: string, maxLength = 1800): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function buildDocEntries(
  doc: VeliteDocMeta,
  rawMdx: string,
): SecSearchIndexEntry[] {
  const hrefBase = `/docs/${doc.slugAsParams}`;
  const plainText = stripMdxToPlainText(rawMdx);
  const keywords = collectKeywords(doc);
  const description = doc.description ?? "";
  const entries: SecSearchIndexEntry[] = [];

  entries.push({
    id: doc.slugAsParams,
    title: doc.title,
    href: hrefBase,
    description,
    section: "",
    keywords: keywords.join(" "),
    content: snippet(`${description} ${plainText}`),
  });

  const quickStart = extractQuickStart(rawMdx);
  if (quickStart) {
    entries.push({
      id: `${doc.slugAsParams}#${quickStart.id}`,
      title: doc.title,
      href: `${hrefBase}#${quickStart.id}`,
      description,
      section: quickStart.title,
      keywords: keywords.join(" "),
      content: snippet(stripMdxToPlainText(quickStart.body)),
    });
  }

  for (const heading of extractHeadings(rawMdx)) {
    const sectionText = stripMdxToPlainText(heading.body);
    entries.push({
      id: `${doc.slugAsParams}#${heading.id}`,
      title: doc.title,
      href: `${hrefBase}#${heading.id}`,
      description,
      section: heading.title,
      keywords: keywords.join(" "),
      content: snippet(sectionText || plainText),
    });
  }

  for (const collapsible of extractCollapsibles(rawMdx)) {
    entries.push({
      id: `${doc.slugAsParams}#${collapsible.id}`,
      title: doc.title,
      href: `${hrefBase}#${collapsible.id}`,
      description,
      section: collapsible.title,
      keywords: keywords.join(" "),
      content: snippet(stripMdxToPlainText(collapsible.body)),
    });
  }

  return entries;
}

export function buildSecSearchIndex(
  docs: VeliteDocMeta[],
  contentRoot: string,
): SecSearchIndex {
  const secDocs = docs
    .filter(isSecDoc)
    .sort((a, b) => a.title.localeCompare(b.title));

  const documents: SecSearchIndexEntry[] = [];

  for (const doc of secDocs) {
    const rawMdx = readMdxSource(contentRoot, doc.slug);
    if (!rawMdx) {
      continue;
    }
    documents.push(...buildDocEntries(doc, rawMdx));
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    documents,
  };
}

export function writeSecSearchIndex(
  index: SecSearchIndex,
  outputPath: string,
): void {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), "utf8");
}
