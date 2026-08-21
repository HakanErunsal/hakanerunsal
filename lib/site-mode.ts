export type SiteMode = "portfolio" | "rigbak";

/**
 * Which brand this build serves. The rigbak.com deployment sets
 * NEXT_PUBLIC_SITE=rigbak; anything else builds the portfolio.
 *
 * Read at build time so each deployment bakes its own branding into the
 * static HTML. Detecting the host in the browser would render one brand
 * and then swap it after hydration.
 */
export const SITE_MODE: SiteMode =
    process.env.NEXT_PUBLIC_SITE === "rigbak" ? "rigbak" : "portfolio";

export const isRigbak = SITE_MODE === "rigbak";
