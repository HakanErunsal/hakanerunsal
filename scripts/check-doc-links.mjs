import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

const CONTENT_ROOT = path.join(process.cwd(), "content", "docs");

/** Every anchor a page publishes: heading ids, Collapsible ids, explicit id props. */
function collectAnchors(raw) {
  const body = raw.replace(/^---[\s\S]*?---\s*\n?/, "");
  const anchors = new Set();
  const slugger = new GithubSlugger();

  for (const match of body.matchAll(/^(#{2,6})\s+(.+)$/gm)) {
    const title = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .trim();
    if (title) anchors.add(slugger.slug(title));
  }

  for (const match of body.matchAll(/<Collapsible\b[^>]*title="([^"]*)"/g)) {
    if (match[1].trim()) anchors.add(new GithubSlugger().slug(match[1].trim()));
  }

  for (const match of body.matchAll(/\bid="([^"]+)"/g)) {
    anchors.add(match[1]);
  }

  // QuickStart carries a default anchor when its id prop is left off.
  if (/<QuickStart\b/.test(body) && !/<QuickStart\b[^>]*\bid=/.test(body)) {
    anchors.add("set-it-up");
  }

  return anchors;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".mdx") ? [full] : [];
  });
}

const files = walk(CONTENT_ROOT);
const anchorsBySlug = new Map();

for (const file of files) {
  const slug = path
    .relative(CONTENT_ROOT, file)
    .replace(/\.mdx$/, "")
    .split(path.sep)
    .join("/");
  anchorsBySlug.set(slug, collectAnchors(fs.readFileSync(file, "utf8")));
}

const problems = [];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const match of line.matchAll(/\]\((\/docs\/[^)\s]*)\)/g)) {
      const [target, fragment] = match[1].split("#");
      const slug = target.replace(/^\/docs\//, "").replace(/\/$/, "");
      const where = `${path.relative(process.cwd(), file)}:${index + 1}`;

      if (!anchorsBySlug.has(slug)) {
        problems.push(`${where}  missing page  ${match[1]}`);
        continue;
      }
      if (fragment && !anchorsBySlug.get(slug).has(fragment)) {
        problems.push(`${where}  missing anchor  ${match[1]}`);
      }
    }
  });
}

if (problems.length) {
  console.error(`Broken internal doc links (${problems.length}):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`Checked ${files.length} pages. Every internal doc link resolves.`);
