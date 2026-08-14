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

/** Host a doc is canonical on, whichever build rendered it. */
export function docHost(slugAsParams: string): string {
    return isRigbakDoc(slugAsParams) ? siteConfig.docsUrl : siteConfig.url;
}
