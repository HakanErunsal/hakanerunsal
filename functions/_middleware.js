/**
 * Host router for the two domains this repo serves.
 *
 * rigbak.com serves the catalogue at /, the docs index, and the docs of the
 * products it sells. hakanerunsal.com serves everything else, including the
 * docs of personal projects. Each host sends the other's paths across with a
 * 301, so any link ever published keeps resolving.
 *
 * Both deployments run this same file, so a request landing on the wrong one
 * is still routed rather than served twice under two addresses.
 *
 * Preview builds on *.pages.dev serve whatever they contain, so a deployment
 * can be checked in full before DNS points at it.
 */

const SITE_HOST = "hakanerunsal.com";
const DOCS_HOST = "rigbak.com";

/**
 * Top-level /docs entries rigbak.com owns. Anything else under /docs is
 * personal work and stays on hakanerunsal.com.
 *
 * lib/docs-ownership.ts carries the same names and decides which docs each
 * build renders. The two lists must change together.
 */
const RIGBAK_DOC_ROOTS = [
  "SoulslikeCombatDocs",
  "soulslike-combat",
  "RevenueCatBridgeDocs",
  "revenuecat-bridge",
];

/**
 * Names a product is reached by that are not the page's own slug: the plugin's
 * own name, the folder its child pages sit under, and spelling variants. A
 * link published anywhere lands on the overview instead of a 404, and the
 * match is case-insensitive so a mistyped capital still resolves.
 *
 * Keys are lowercase and cover one path segment only, so a child page such as
 * /docs/soulslike-combat/vitals routes normally.
 */
const DOC_ALIASES = {
  "soulslikeenemycombat": "/docs/SoulslikeCombatDocs",
  "soulslike-enemy-combat": "/docs/SoulslikeCombatDocs",
  "soulslikecombat": "/docs/SoulslikeCombatDocs",
  "soulslike-combat": "/docs/SoulslikeCombatDocs",
  "soulslikecombatdocs": "/docs/SoulslikeCombatDocs",
  "sec": "/docs/SoulslikeCombatDocs",
  "revenuecat": "/docs/RevenueCatBridgeDocs",
  "revenuecatbridge": "/docs/RevenueCatBridgeDocs",
  "revenuecat-bridge": "/docs/RevenueCatBridgeDocs",
  "revenuecatbridgedocs": "/docs/RevenueCatBridgeDocs",
  "metahumantomanny": "/docs/MetahumanToMannyDocs",
  "metahuman-to-manny": "/docs/MetahumanToMannyDocs",
  "metahumantomannydocs": "/docs/MetahumanToMannyDocs",
};

/**
 * Canonical path for an alias, or null when the request is already correct or
 * is not an alias at all. Returning null for an exact match is what keeps a
 * real page from redirecting onto itself.
 */
function aliasTarget(pathname) {
  if (!pathname.startsWith("/docs/")) {
    return null;
  }
  const rest = pathname.slice("/docs/".length).replace(/\/$/, "");
  if (rest === "" || rest.includes("/")) {
    return null;
  }
  const target = DOC_ALIASES[rest.toLowerCase()];
  return target && target !== pathname ? target : null;
}

/** Build output and content assets, which both hosts load. */
function isAssetPath(pathname) {
  return pathname.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(pathname);
}

/** The docs index, which both hosts render with their own product list. */
function isDocsIndex(pathname) {
  return pathname === "/docs" || pathname === "/docs/";
}

function isRigbakDocPath(pathname) {
  if (!pathname.startsWith("/docs/")) {
    return false;
  }
  const root = pathname.slice("/docs/".length).split("/")[0];
  return RIGBAK_DOC_ROOTS.includes(root);
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const hostname = url.hostname;

  if (hostname.endsWith(".pages.dev") || hostname === "localhost") {
    return next();
  }

  // A www host serves the same site as its apex rather than redirecting to it.
  // rigbak.com spent years on a platform that required www and answered the
  // apex with a permanent redirect, which browsers cache indefinitely. Sending
  // www back to the apex would bounce every one of those browsers between the
  // two forever. Each page names its apex address as canonical, so serving
  // both costs nothing in search.
  const host = hostname.startsWith("www.") ? hostname.slice(4) : hostname;

  if (isAssetPath(url.pathname)) {
    return next();
  }

  // Resolve an alias before host routing, so the redirect lands on the host
  // that owns the product rather than bouncing twice.
  const alias = aliasTarget(url.pathname);
  if (alias) {
    url.pathname = alias;
    url.hostname = isRigbakDocPath(alias) ? DOCS_HOST : SITE_HOST;
    return Response.redirect(url.toString(), 301);
  }

  if (host === DOCS_HOST) {
    if (
      url.pathname === "/" ||
      isDocsIndex(url.pathname) ||
      isRigbakDocPath(url.pathname)
    ) {
      return next();
    }
    url.hostname = SITE_HOST;
    return Response.redirect(url.toString(), 301);
  }

  if (host === SITE_HOST && isRigbakDocPath(url.pathname)) {
    url.hostname = DOCS_HOST;
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
