/**
 * Copy official UE 5.8 Starship SVG icons from a local engine install into public/ue-icons/.
 *
 * Usage:
 *   node scripts/copy-ue-icons.js "C:/Program Files/Epic Games/UE_5.5"
 *   node scripts/copy-ue-icons.js "D:/UE/UE_5.5"
 *
 * Source paths (from StarshipStyle.cpp):
 *   Engine/Content/Editor/Slate/Starship/AssetIcons/ActorComponent_16.svg
 *   Engine/Content/Editor/Slate/Starship/AssetIcons/DataAsset_64.svg (via ClassThumbnail)
 */

const fs = require("fs");
const path = require("path");

const engineRoot = process.argv[2];
if (!engineRoot) {
  console.error("Usage: node scripts/copy-ue-icons.js <UE_ENGINE_ROOT>");
  process.exit(1);
}

const ICONS = [
  "Starship/AssetIcons/ActorComponent_16.svg",
  "Starship/AssetIcons/ActorComponent_64.svg",
  "Starship/AssetIcons/SceneComponent_16.svg",
  "Starship/AssetIcons/Blueprint_64.svg",
  "Starship/AssetIcons/DataAsset_64.svg",
];

const searchRoots = [
  path.join(engineRoot, "Engine/Content/Editor/Slate"),
  path.join(engineRoot, "Engine/Content/Slate"),
];

const outDir = path.join(__dirname, "..", "public", "ue-icons");
fs.mkdirSync(outDir, { recursive: true });

let copied = 0;
for (const rel of ICONS) {
  let src = null;
  for (const root of searchRoots) {
    const candidate = path.join(root, rel);
    if (fs.existsSync(candidate)) {
      src = candidate;
      break;
    }
  }
  if (!src) {
    console.warn(`Missing: ${rel}`);
    continue;
  }
  const dest = path.join(outDir, path.basename(rel));
  fs.copyFileSync(src, dest);
  console.log(`Copied ${path.basename(rel)}`);
  copied++;
}

console.log(copied ? `Done — ${copied} icons in public/ue-icons/` : "No icons copied. Check engine path.");
