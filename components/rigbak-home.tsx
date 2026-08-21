import Link from "next/link";
import Image from "next/image";
import { docs, projects } from "#site/content";
import { rigbakGames, rigbakPlugins } from "@/config/rigbak";

interface CardProps {
    title: string;
    description?: string;
    image?: string;
    href: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    external?: boolean;
}

function ExternalIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
    );
}

function CatalogueCard({
    title,
    description,
    image,
    href,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    external,
}: CardProps) {
    return (
        <div className="flex flex-col overflow-hidden border border-border/50 rounded-sm bg-ue-sidebar/40 hover:border-primary/30 transition-colors duration-200">
            <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="block group"
            >
                <div className="w-full aspect-[16/9] relative bg-background">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : null}
                </div>
            </Link>

            <div className="flex flex-col flex-1 gap-3 p-5">
                <h3 className="font-heading font-semibold text-lg leading-tight">
                    <Link
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className="hover:text-primary transition-colors"
                    >
                        {title}
                    </Link>
                </h3>

                {description ? (
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {description}
                    </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        {primaryLabel}
                        {external ? <ExternalIcon /> : null}
                    </Link>

                    {secondaryHref && secondaryLabel ? (
                        <a
                            href={secondaryHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                        >
                            {secondaryLabel}
                            <ExternalIcon />
                        </a>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="pb-14">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
        </section>
    );
}

export function RigbakHome() {
    const pluginCards = rigbakPlugins
        .map((entry) => {
            const doc = docs.find((d) => d.slugAsParams === entry.docSlug);
            if (!doc || !doc.published) {
                return null;
            }
            return { entry, doc };
        })
        .filter((v): v is NonNullable<typeof v> => v !== null);

    const gameCards = rigbakGames
        .map((entry) => {
            const project = projects.find((p) => p.slug === entry.projectSlug);
            if (!project || !project.published) {
                return null;
            }
            return { entry, project };
        })
        .filter((v): v is NonNullable<typeof v> => v !== null);

    return (
        <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col justify-center items-center h-72 py-8 text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                    Rigbak
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl">
                    Unreal Engine plugins and games, built solo.
                </p>
            </div>

            <hr className="border-border/50 mb-10" />

            {pluginCards.length > 0 && (
                <Section title="Unreal Engine Plugins">
                    {pluginCards.map(({ entry, doc }) => (
                        <CatalogueCard
                            key={doc.slug}
                            title={doc.title}
                            description={doc.description}
                            image={doc.image?.src}
                            href={`/${doc.slug}`}
                            primaryLabel="Documentation"
                            secondaryHref={entry.storeUrl}
                            secondaryLabel={entry.storeLabel}
                        />
                    ))}
                </Section>
            )}

            {gameCards.length > 0 && (
                <Section title="Games">
                    {gameCards.map(({ entry, project }) => (
                        <CatalogueCard
                            key={project.slug}
                            title={project.title}
                            description={project.description}
                            image={project.image?.src}
                            href={entry.url}
                            primaryLabel={entry.linkLabel}
                            external
                        />
                    ))}
                </Section>
            )}
        </div>
    );
}
