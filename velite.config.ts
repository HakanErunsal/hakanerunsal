import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { SiteConfig, siteConfig } from "./config/site";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

// Define collection for both blog posts and project posts
const articles = defineCollection({
  name: 'Article',
  pattern: 'articles/**/*.mdx', // Adjust the pattern to collect all MDX files
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      image: s.image().optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
      // Add any other common attributes
    })
    .transform(computedFields),
});

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx', // Adjust the pattern to collect all MDX files
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      image: s.image().optional(),
      images: s.array(s.object({src: s.string(), alt: s.string()})).optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      links: s.array(s.string()).optional(),
      body: s.mdx(),
      // Add any other common attributes
    })
    .transform(computedFields),
});

const customBase: `/${string}/` | `.${string}/` | `-${string}/` | `.${string}:${string}/` | undefined = process.env.NODE_ENV === 'production'
? `${siteConfig.repoName}` //`/${siteConfig.repoName}/static/`
: '/static/';

//const customBase = `/${siteConfig.repoName}/static/` as `/${string}/static/`;

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: customBase,
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { articles, projects },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-dark" }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
    remarkPlugins: [],
  },
});