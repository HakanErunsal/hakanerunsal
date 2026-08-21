import { isRigbak } from "@/lib/site-mode";
import { siteConfig } from "@/config/site";

/**
 * Top-level content/docs entries rigbak.com owns. A doc's slugAsParams is
 * either one of these ("SoulslikeCombatDocs") or sits beneath one
 * ("soulslike-combat/getting-started").
 *
 * Anything absent is personal work and stays on hakanerunsal.com, which is
 * why this is a list of products rather than a blanket rule on /docs.
 *
 * functions/_middleware.js carries the same names as URL prefixes and routes
 * live requests by them. The two lists must change together.
 */
export const RIGBAK_DOC_ROOTS = [
    "SoulslikeCombatDocs",
    "soulslike-combat",
    "RevenueCatBridgeDocs",
    "revenuecat-bridge",
];

export function isRigbakDoc(slugAsParams: string): boolean {
    return RIGBAK_DOC_ROOTS.includes(slugAsParams.split("/")[0]);
}

/** The docs this build's host serves, dropping the ones the other host owns. */
export function ownedDocs<T extends { slugAsParams: string }>(all: T[]): T[] {
    return all.filter((doc) => isRigbakDoc(doc.slugAsParams) === isRigbak);
}

/** True when this build lists a doc but another host holds the page. */
export function isOffsiteDoc(slugAsParams: string): boolean {
    return isRigbakDoc(slugAsParams) !== isRigbak;
}

/**
 * The docs a navigation surface lists. The portfolio lists every product,
 * including the ones rigbak.com holds, so a reader finds all of the work from
 * one place; those entries link out rather than resolving locally.
 *
 * rigbak.com lists only what it sells, so personal work stays off the
 * storefront.
 *
 * Navigation only. app/sitemap.ts stays on ownedDocs, so each host advertises
 * the URLs it answers itself, while generateStaticParams stays on the full set,
 * so both builds render every doc and each page names its owning host.
 */
export function listedDocs<T extends { slugAsParams: string }>(all: T[]): T[] {
    return isRigbak ? all.filter((doc) => isRigbakDoc(doc.slugAsParams)) : all;
}

/** Host a doc is canonical on, whichever build rendered it. */
export function docHost(slugAsParams: string): string {
    return isRigbakDoc(slugAsParams) ? siteConfig.docsUrl : siteConfig.url;
}

/** Where a doc link points: a local path, or the owning host when this build has no such page. */
export function docHref(slug: string, slugAsParams: string): string {
    return isOffsiteDoc(slugAsParams) ? `${docHost(slugAsParams)}/${slug}` : `/${slug}`;
}
