/**
 * Host router for the two domains this deployment answers.
 *
 * rigbak.com serves /docs and sends everything else to hakanerunsal.com.
 * hakanerunsal.com serves everything else and sends /docs to rigbak.com.
 * Preview builds on *.pages.dev serve both halves, so a deployment can be
 * checked in full before DNS points at it.
 */

const SITE_HOST = "hakanerunsal.com";
const DOCS_HOST = "rigbak.com";

/** Build output and content assets, which both hosts load. */
function isAssetPath(pathname) {
  return pathname.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(pathname);
}

function isDocsPath(pathname) {
  return pathname === "/docs" || pathname.startsWith("/docs/");
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
    if (isDocsPath(url.pathname)) {
      return next();
    }
    // The apex carries no page of its own, so it opens the docs index.
    if (url.pathname === "/") {
      url.pathname = "/docs";
      return Response.redirect(url.toString(), 302);
    }
    url.hostname = SITE_HOST;
    return Response.redirect(url.toString(), 301);
  }

  if (hostname === SITE_HOST && isDocsPath(url.pathname)) {
    url.hostname = DOCS_HOST;
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
