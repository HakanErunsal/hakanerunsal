// Importing necessary modules and components
import { sortDocs } from "@/lib/utils";
import { docs } from "#site/content";
import MediaCard from "@/components/media-card";

// Docs functional component
export default function DocsPage() {
    // Sorting and selecting published docs (excluding sub-pages with parent field)
    const publishedDocs = sortDocs(docs.filter(d => d.published && !d.parent)).slice(0, 20);

    return (
        <div className="max-w-5xl mx-auto px-6">
            {/* Hero section */}
            <div className="flex flex-col justify-center items-center h-64 py-8">
                <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                    Documentation
                </h1>
                <p className="mt-4 text-base text-muted-foreground">
                    Guides & references for my projects
                </p>
            </div>

            <hr className="border-border/50 mb-8" />

            {/* Grid for displaying docs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {publishedDocs.map((doc) => (
                    <div key={doc.slug}>
                        <MediaCard
                            slug={doc.slug}
                            image={doc.image?.src || ''}
                            title={doc.title}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
