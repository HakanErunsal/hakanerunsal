/**
 * What rigbak.com lists.
 *
 * Curated rather than derived from the `developer` frontmatter field, which
 * credits who built a thing: it marks the older mobile games as Rigbak and
 * the plugins as a personal credit, which is the opposite of this split.
 *
 * Titles, descriptions and thumbnails come from the content collections at
 * render time, so an entry here carries only what content does not: the
 * storefront link and the ordering.
 */

export interface RigbakPlugin {
    /** slugAsParams of the root doc holding this product's documentation. */
    docSlug: string;
    /** Public storefront listing. Omitted while a product is unlisted. */
    storeUrl?: string;
    /** Label for the storefront button. */
    storeLabel?: string;
}

export const rigbakPlugins: RigbakPlugin[] = [
    {
        docSlug: "SoulslikeCombatDocs",
        storeUrl: "https://www.fab.com/listings/7087cec0-6975-4de5-82e0-0de0b9b3e9a7",
        storeLabel: "View on Fab",
    },
    {
        docSlug: "RevenueCatBridgeDocs",
    },
];

export interface RigbakGame {
    /** Slug of the project entry supplying title, description and thumbnail. */
    projectSlug: string;
    /** Where the card sends a visitor. */
    url: string;
    /** Label for the link button. */
    linkLabel: string;
}

/**
 * Newest first. The older titles have no site or store link in content, so
 * their cards open the project page on the portfolio, which is where the
 * screenshots and write-up live.
 */
export const rigbakGames: RigbakGame[] = [
    {
        projectSlug: "projects/TheLastLine",
        url: "https://thelastline.rigbak.com",
        linkLabel: "Visit the site",
    },
    {
        projectSlug: "projects/CoverShooter",
        url: "https://hakanerunsal.com/projects/CoverShooter",
        linkLabel: "About this game",
    },
    {
        projectSlug: "projects/JusticeGun2",
        url: "https://hakanerunsal.com/projects/JusticeGun2",
        linkLabel: "About this game",
    },
    {
        projectSlug: "projects/JusticeGun",
        url: "https://hakanerunsal.com/projects/JusticeGun",
        linkLabel: "About this game",
    },
];

export const rigbakLinks = {
    discord: "https://discord.com/invite/CbRcTsYQcz",
};
