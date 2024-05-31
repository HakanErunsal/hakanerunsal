import { articles } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";

import "@/styles/mdx.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Tag } from "@/components/tag";
interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = articles.find((project) => project.slugAsParams === slug);

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
          url: `/api/og?${ogSearchParams.toString()}`,
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
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return articles.map((project) => ({ slug: project.slugAsParams.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const project = await getPostFromParams(params);

  if (!project || !project.published) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row">
    <div className="flex-none w-[26rem] md:w-[26rem]"></div>
    <div className="flex-1 col-span-2 mt-4 md:mt-0 mr-0 md:mr-8">
    <article className="container py-6 prose dark:prose-invert max-w-6xl justify-start">
      <h1 className="mb-2">{project.title}</h1>
      <div className="flex gap-2 mb-2">
        {project.tags?.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      {project.description ? (
        <p className="text-xl mt-0 text-muted-foreground">{project.description}</p>
      ) : null}
      <hr className="my-4" />
      <MDXContent code={project.body} />
    </article>
    </div>
    </div>
  );
}
