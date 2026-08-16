import fs from "node:fs";
import path from "node:path";

/**
 * Fails when a color value appears anywhere in the UE editor kit outside its
 * theme files. Pass --report to list findings and exit 0.
 */

const ROOT = process.cwd();
const KIT_DIR = path.join(ROOT, "components", "ue-editor");
const CSS_FILE = path.join(ROOT, "styles", "ue-editor.css");

/** Theme files own every value, so they are read for tokens and never flagged. */
const THEME_FILES = ["ue-theme.ts", "ue-blueprint-theme.ts"].map((f) => path.join(KIT_DIR, f));

/** Pure white and black carry no brand and stay legal inline. */
const NEUTRAL_LITERALS = new Set(["#fff", "#ffffff", "#000", "#000000"]);

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNCTIONAL = /\b(rgba?|hsla?)\([^)]*\)/gi;

const reportOnly = process.argv.includes("--report");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

/** Expands #abc to #aabbcc so short and long forms compare equal. */
function normalizeHex(value) {
  const hex = value.toLowerCase();
  if (hex.length !== 4) return hex;
  return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
}

function normalizeFunctional(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}

/** True when the three color channels sit within 8 of each other, which reads as grey. */
function isNeutralChannels(value) {
  const parts = value.match(/-?[\d.]+%?/g);
  if (!parts || parts.length < 3) return false;
  const [r, g, b] = parts.slice(0, 3).map((p) => parseFloat(p));
  if ([r, g, b].some((n) => Number.isNaN(n))) return false;
  return Math.max(r, g, b) - Math.min(r, g, b) <= 8;
}

const tokens = new Set();
for (const file of THEME_FILES) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.match(HEX) ?? []) tokens.add(normalizeHex(m));
  for (const m of text.match(FUNCTIONAL) ?? []) tokens.add(normalizeFunctional(m));
}

const findings = [];

function record(file, index, reason, value) {
  findings.push(`${path.relative(ROOT, file)}:${index + 1}  ${reason}  ${value}`);
}

/** Reports every color literal on a line, applying the neutral exemptions. */
function scanLine(file, line, index, { allowHex = false } = {}) {
  if (!allowHex) {
    for (const raw of line.match(HEX) ?? []) {
      if (NEUTRAL_LITERALS.has(raw.toLowerCase())) continue;
      record(file, index, "hardcoded-color", raw);
    }
  }
  for (const raw of line.match(FUNCTIONAL) ?? []) {
    if (/^hsla?\(/i.test(raw)) {
      record(file, index, "hardcoded-color", raw);
      continue;
    }
    if (!isNeutralChannels(raw)) record(file, index, "chromatic-rgba", raw);
  }
}

/** A color inside a Tailwind arbitrary value, which reaches the DOM as a class. */
const TAILWIND_ARBITRARY = /-\[[^\]]*#[0-9a-fA-F]{3,6}[^\]]*\]/g;

/**
 * An alpha modifier on an arbitrary var() color. Tailwind cannot fold an alpha
 * into a var, so it emits no rule and the element silently falls back to an
 * inherited color. Bake the alpha into a token instead.
 */
const DEAD_ALPHA_VAR = /\[color:var\(--[a-z0-9-]+\)\]\/[0-9]+/g;

for (const file of walk(KIT_DIR)) {
  const isTheme = THEME_FILES.includes(file);
  fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line, index) => {
      // A theme file declares token values, so bare hex is expected there. A
      // Tailwind arbitrary value is not a declaration and is flagged anywhere.
      for (const raw of line.match(DEAD_ALPHA_VAR) ?? []) {
        record(file, index, "alpha-on-var-emits-nothing", raw);
      }
      if (isTheme) {
        for (const raw of line.match(TAILWIND_ARBITRARY) ?? []) {
          record(file, index, "hardcoded-color", raw);
        }
        return;
      }
      scanLine(file, line, index);
    });
}

if (fs.existsSync(CSS_FILE)) {
  const lines = fs.readFileSync(CSS_FILE, "utf8").split(/\r?\n/);
  // Hex is legal only inside the leading :root block, and only for values the
  // theme already defines, which is what pins the two files together.
  const rootStart = lines.findIndex((l) => /^\s*:root\s*\{/.test(l));
  let rootEnd = -1;
  if (rootStart !== -1) {
    for (let i = rootStart; i < lines.length; i++) {
      if (/\}/.test(lines[i])) {
        rootEnd = i;
        break;
      }
    }
  }

  lines.forEach((line, index) => {
    const inRoot = rootStart !== -1 && index >= rootStart && index <= rootEnd;
    if (!inRoot) {
      scanLine(CSS_FILE, line, index);
      return;
    }
    for (const raw of line.match(HEX) ?? []) {
      if (!tokens.has(normalizeHex(raw))) record(CSS_FILE, index, "unknown-token-value", raw);
    }
    for (const raw of line.match(FUNCTIONAL) ?? []) {
      if (!tokens.has(normalizeFunctional(raw)) && !isNeutralChannels(raw)) {
        record(CSS_FILE, index, "unknown-token-value", raw);
      }
    }
  });
}

if (findings.length) {
  console.error(`UE kit colors outside the theme (${findings.length}):\n`);
  for (const finding of findings) console.error(`  ${finding}`);
  if (!reportOnly) process.exit(1);
  console.error("\nReport mode: not failing.");
} else {
  console.log("UE kit colors all resolve to theme tokens.");
}
