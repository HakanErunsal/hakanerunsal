import { docs } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";

import "@/styles/mdx.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Tag } from "@/components/tag";
import { DocsSidebar } from "@/components/docs-sidebar";
interface DocPageProps {
    params: {
        slug: string[];
    };
}

async function getDocFromParams(params: DocPageProps["params"]) {
    const slug = params?.slug?.join("/");
    const doc = docs.find((d) => d.slugAsParams === slug);

    return doc;
}

export async function generateMetadata({
    params,
}: DocPageProps): Promise<Metadata> {
    const doc = await getDocFromParams(params);

    if (!doc) {
        return {};
    }

    const ogSearchParams = new URLSearchParams();
    ogSearchParams.set("title", doc.title);

    return {
        title: doc.title,
        description: doc.description,
        authors: { name: siteConfig.author },
        openGraph: {
            title: doc.title,
            description: doc.description,
            type: "article",
            url: doc.slug,
            images: [
                {
                    url: `/api/og?${ogSearchParams.toString()}`,
                    width: 1200,
                    height: 630,
                    alt: doc.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: doc.title,
            description: doc.description,
            images: [`/api/og?${ogSearchParams.toString()}`],
        },
    };
}

export async function generateStaticParams(): Promise<
    DocPageProps["params"][]
> {
    return docs.map((doc) => ({ slug: doc.slugAsParams.split("/") }));
}

export default async function DocPage({ params }: DocPageProps) {
    const doc = await getDocFromParams(params);

    if (!doc || !doc.published) {
        notFound();
    }

    return (
        <div className="flex flex-col md:flex-row">
            {/* Docs Sidebar - Table of Contents */}
            <DocsSidebar />

            {/* Spacer to account for fixed sidebar + logo area on large screens */}
            <div className="flex-none w-0 lg:w-72"></div>

            {/* Spacer for logo/nav area - matching articles page */}
            <div className="flex-none w-[26rem] md:w-[10rem] lg:w-[10rem]"></div>

            <div className="flex-1 mt-4 md:mt-0 mr-0 md:mr-8">
                <article className="container py-6 prose dark:prose-invert max-w-5xl justify-start">
                    <h1 className="mb-2">{doc.title}</h1>
                    <div className="flex gap-2 mb-2">
                        {doc.tags?.map((tag) => (
                            <Tag tag={tag} key={tag} />
                        ))}
                    </div>
                    {doc.description ? (
                        <p className="text-xl mt-0 text-muted-foreground">{doc.description}</p>
                    ) : null}
                    <hr className="my-4" />
                    <MDXContent code={doc.body} />
                </article>
            </div>
        </div>
    );
}
