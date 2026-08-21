import { isRigbak } from "../lib/site-mode";

export const siteConfig = {
  name: "Hakan Erunsal",
  url: "https://hakanerunsal.com",
  // Everything under /docs is canonical on this host. Two builds of this repo
  // serve the two domains; functions/_middleware.js sends each request to the
  // host that owns it.
  docsUrl: "https://rigbak.com",
  repoName: "",
  description: "Game Developer & Software Engineer specializing in Unreal Engine. Portfolio of mobile shooter games and technical articles.",
  author: "Hakan Erunsal",
  links: {
    twitter: "https://twitter.com/Hakan_Erunsal",
    github: "https://github.com/hakanerunsal",
    linkedin: "https://www.linkedin.com/in/hakandev/",
    email: "hakanerunsal2@gmail.com",
  },
};

export type SiteConfig = typeof siteConfig;

/**
 * Identity of the brand this build serves. Titles, canonical hosts and social
 * cards read from here rather than from siteConfig directly, so the rigbak
 * build never labels a page with the portfolio's name.
 */
export const brandConfig = isRigbak
  ? {
      name: "Rigbak",
      url: siteConfig.docsUrl,
      description: "Unreal Engine plugins and games, built solo.",
      tagline: "Plugins & Games",
    }
  : {
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      tagline: "Game Developer & Technical Artist",
    };
