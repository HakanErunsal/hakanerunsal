import { docs } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";

import "@/styles/mdx.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Tag } from "@/components/tag";
import { DocsPageTOC } from "@/components/docs-page-toc";
import { Breadcrumb } from "@/components/breadcrumb";
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

    return {
        title: doc.title,
        description: doc.description,
        authors: { name: siteConfig.author },
        openGraph: {
            title: doc.title,
            description: doc.description,
            type: "article",
            url: doc.slug,
        },
        twitter: {
            card: "summary",
            title: doc.title,
            description: doc.description,
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
        <div className="max-w-[76rem] mx-auto px-6 lg:px-10 flex gap-8">
            {/* Content */}
            <div className="flex-1 min-w-0 max-w-[58rem]">
                {/* Breadcrumbs */}
                <div className="pt-6">
                    <Breadcrumb items={[
                        { label: "Docs", href: "/docs" },
                        ...(doc.parent
                            ? [{
                                label: docs.find(d => d.slugAsParams === doc.parent)?.title || doc.parent,
                                href: "/" + (docs.find(d => d.slugAsParams === doc.parent)?.slug || "docs")
                            }]
                            : []),
                        { label: doc.title },
                    ]} />
                </div>

                <article className="py-6 prose dark:prose-invert max-w-none">
                    <h1 className="font-heading mb-2">{doc.title}</h1>
                    <div className="flex gap-2 mb-2">
                        {doc.tags?.map((tag) => (
                            <Tag tag={tag} key={tag} />
                        ))}
                    </div>
                    {doc.description ? (
                        <p className="text-lg mt-0 text-muted-foreground">{doc.description}</p>
                    ) : null}
                    <hr className="my-4" />
                    <MDXContent code={doc.body} />
                </article>
            </div>

            {/* Right TOC - sticky, aligned with content */}
            <DocsPageTOC />
        </div>
    );
}
