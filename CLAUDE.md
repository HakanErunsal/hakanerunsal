# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server (Velite runs in watch mode via the webpack plugin in `next.config.js`).
- `npm run build` — Production build. Velite runs once at the start of compilation to regenerate `.velite/` from `content/`.
- `npm run start` — Serve the built app.
- `npm run lint` — `next lint` (config in `.eslintrc.json` extends `next/core-web-vitals`).
- `node scripts/generate-og.js` — Regenerate the static OG card image from `public/logos/H_Logo.png` using `sharp`. Sharp is not in `package.json`; install it ad-hoc if needed.

There is no test runner configured.

## Architecture

This is a Next.js 14 App Router portfolio + docs site. Content is authored in MDX, compiled by Velite at build time into typed JS modules, and consumed by the App Router pages.

### Velite content pipeline (the central piece)

`velite.config.ts` defines three collections, all rooted at `content/`:

- `articles` — `content/articles/**/*.mdx`
- `projects` — `content/projects/**/*.mdx`
- `docs` — `content/docs/**/*.mdx`

Each MDX file's frontmatter is validated against a Zod-like schema (`s.object({...})`). The `body` field is compiled to MDX runtime code (a string of JS that returns a React component). All three collections add a `slugAsParams` computed field (the slug minus its first segment, e.g. `docs/foo/bar` → `foo/bar`).

The `docs` schema has an extra `parent: string` field — `slugAsParams` of another doc — which builds the two-level docs hierarchy seen in the sidebar (see `components/site-tree-sidebar.tsx` and the breadcrumb logic in `app/(main)/docs/[...slug]/page.tsx`).

Output:
- `.velite/` — generated TS/JS modules + `index.d.ts` (imported as `#site/content` via the path alias in `tsconfig.json`).
- `public/static/` — assets referenced from MDX, hashed as `[name]-[hash:6].[ext]`. Output `base` is `/static/`.

The custom `VeliteWebpackPlugin` in `next.config.js` triggers `velite.build()` once per Next compilation (Next compiles three times — server/edge/client — so the `started` flag prevents duplicate runs). In dev mode it enables `watch`; in prod it enables `clean`. Running `velite` standalone via npx isn't necessary because the webpack plugin handles it.

### Routes

- Root layout: `app/layout.tsx` (fonts, metadata, `Providers`).
- All site pages live under the `(main)` route group, which adds the persistent `SiteTreeSidebar` and `SiteFooter` (`app/(main)/layout.tsx`). The sidebar reserves `lg:ml-72` of left margin.
- Dynamic content routes use catch-all `[...slug]` segments and `generateStaticParams` driven by Velite collections — e.g. `app/(main)/docs/[...slug]/page.tsx` matches a doc by `slugAsParams === params.slug.join("/")`. Same pattern for `articles` and `projects`.
- `app/job-hunt/` is a separate top-level route outside the `(main)` group with its own layout.
- `app/sitemap.ts` and `app/robots.ts` generate those files from Velite collections + `siteConfig`.

### MDX rendering

`components/mdx-components.tsx` is the single integration point between MDX and React. `useMDXComponent` evaluates Velite's compiled `body` string with `new Function(code)` and the React jsx-runtime, then renders it with a fixed `components` map. Any custom MDX tag used in content (e.g. `<ActionFlowVisualizer />`, `<Callout>`, `<ZoomableImage>`, `<VideoLoop>`, `<Protip>`, `<BlueprintUE>`, `<DocNav>`, `<Breadcrumb>`, plus the many `*Visualizer` components) must be registered in this `components` object — otherwise it will be undefined at render time. The `p` override wraps paragraphs in a `<div>` so block-level children (visualizers, images) don't trigger hydration warnings from being nested inside `<p>`.

### Styling

- Tailwind (`tailwind.config.ts`) + `tailwindcss-animate` + `@tailwindcss/typography`.
- shadcn/ui is configured (`components.json`); generated UI primitives live under `components/ui/`. Path alias `@/*` resolves from project root.
- Theming via `next-themes` (`components/providers.tsx`, `components/mode-toggle.tsx`).
- MDX-specific styles: `styles/mdx.css`, imported by the doc/article/project pages.
- Code blocks: `rehype-pretty-code` with theme `github-dark`; headings are slugged + autolinked via `rehype-slug` and `rehype-autolink-headings`.

### Path aliases

- `@/*` → project root (e.g. `@/components/...`, `@/lib/utils`, `@/config/site`).
- `#site/content` → `./.velite` (the generated content modules — always import collections from here, never from the raw MDX).

## Content authoring

When adding a new doc/article/project, the MDX frontmatter must satisfy the corresponding Velite schema, and Velite runs at build time so frontmatter errors surface as build failures, not runtime errors. For docs, set `parent` to the `slugAsParams` of the umbrella doc to nest it in the sidebar tree (e.g. children of `SoulslikeCombatDocs` set `parent: "SoulslikeCombatDocs"`). Images referenced from MDX with a relative path are processed through Velite into `public/static/` — they should not be placed in `public/` directly unless they are static assets unrelated to content (logos, OG cards, etc.).
