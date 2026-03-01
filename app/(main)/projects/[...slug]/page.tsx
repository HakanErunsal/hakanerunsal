import { projects } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";

import "@/styles/mdx.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Tag } from "@/components/tag";
import { DocsPageTOC } from "@/components/docs-page-toc";
import { Breadcrumb } from "@/components/breadcrumb";

interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = projects.find((project) => project.slugAsParams === slug);

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const project = await getPostFromParams(params);

  if (!project) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", project.title);

  // Use the project's image if available, otherwise fall back to dynamic OG
  const ogImage = project.image?.src
    ? project.image.src
    : `/api/og?${ogSearchParams.toString()}`;

  return {
    title: project.title,
    description: project.description,
    authors: { name: siteConfig.author },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: project.slug,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return projects.map((project) => ({ slug: project.slugAsParams.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const project = await getPostFromParams(params);

  if (!project || !project.published) {
    notFound();
  }

  return (
    <div className="max-w-[76rem] mx-auto px-6 lg:px-10 flex gap-8">
      {/* Content */}
      <div className="flex-1 min-w-0 max-w-[58rem]">
        {/* Breadcrumbs */}
        <div className="pt-6">
          <Breadcrumb items={[
            { label: "Projects", href: "/projects" },
            { label: project.title },
          ]} />
        </div>

        <article className="py-6 prose dark:prose-invert max-w-none">
          <h1 className="font-heading mb-2">{project.title}</h1>
          <div className="flex gap-2 mb-2">
            {project.tags?.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>
          {project.description ? (
            <p className="text-lg mt-0 text-muted-foreground">{project.description}</p>
          ) : null}
          <hr className="my-4" />
          <MDXContent code={project.body} />
        </article>
      </div>

      {/* Right TOC — sticky, aligned with content */}
      <DocsPageTOC />
    </div>
  );
}
