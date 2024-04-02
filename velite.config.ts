import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Define collection for both blog posts and project posts
const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx', // Adjust the pattern to collect all MDX files
  schema: s
    .object({
      slug: s.slug('blog'),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      image: s.string(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
      // Add any other common attributes
    })
    .transform(data => ({...data, permalink: '/blog/${data.slug}'})),
});

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx', // Adjust the pattern to collect all MDX files
  schema: s
    .object({
      slug: s.slug('projects'),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      image: s.string(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
      links: s.array(s.string()).optional()
      // Add any other common attributes
    })
    .transform(data => ({...data, permalink: '/projects/${data.slug}'})),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, projects },
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