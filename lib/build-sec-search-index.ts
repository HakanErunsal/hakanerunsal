import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import {
  SEC_DOC_SEARCH_KEYWORDS,
  SEC_GLOBAL_SEARCH_KEYWORDS,
} from "@/config/sec-doc-search-keywords";

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
  let text = stripFrontmatter(raw);

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
  const headings: ParsedHeading[] = [];

  for (const match of Array.from(text.matchAll(/^(#{2,3})\s+(.+)$/gm))) {
    const level = match[1].length;
    const title = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .trim();

    if (!title) {
      continue;
    }

    headings.push({
      level,
      title,
      id: slugger.slug(title),
    });
  }

  return headings;
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

function snippet(text: string, maxLength = 140): string {
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

  for (const heading of extractHeadings(rawMdx)) {
    entries.push({
      id: `${doc.slugAsParams}#${heading.id}`,
      title: doc.title,
      href: `${hrefBase}#${heading.id}`,
      description,
      section: heading.title,
      keywords: keywords.join(" "),
      content: snippet(plainText),
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
