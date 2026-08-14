export const siteConfig = {
  name: "Hakan Erunsal",
  url: "https://hakanerunsal.com",
  // Everything under /docs is canonical on this host. One build answers both
  // domains; functions/_middleware.js routes each request to the right half.
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