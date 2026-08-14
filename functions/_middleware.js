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

  if (hostname.startsWith("www.")) {
    url.hostname = hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }

  if (isAssetPath(url.pathname)) {
    return next();
  }

  if (hostname === DOCS_HOST) {
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

  if (hostname === SITE_HOST && isRigbakDocPath(url.pathname)) {
    url.hostname = DOCS_HOST;
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
