// Importing necessary modules and components
import { sortDocs } from "@/lib/utils"; // Importing utility functions from utils module
import { docs } from "#site/content"; // Importing docs data from content
import MediaCard from "@/components/media-card"; // Importing MediaCard component

// Docs functional component
export default function DocsPage() {
    // Sorting and selecting published docs (excluding sub-pages with parent field)
    const publishedDocs = sortDocs(docs.filter(d => d.published && !d.parent)).slice(0, 20);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left column */}
            <div className=""></div>
            {/* Right column */}
            <div className="col-span-2 mt-4 md:mt-0 mr-0 md:mr-8">
                {/* Hero section */}
                <div className="flex flex-col justify-center items-center md:items-end lg:items-center h-80 p-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Documentation
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground font-mono">
                        Guides & references for my projects
                    </p>
                </div>

                <hr className="size-5 border-gray-600 w-full" />

                {/* Grid for displaying docs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Mapping over docs and rendering MediaCard for each */}
                    {publishedDocs.map((doc) => (
                        <div key={doc.slug}>
                            {/* MediaCard component */}
                            <MediaCard
                                slug={doc.slug} // Slug of the doc
                                image={doc.image?.src || ''} // URL of the doc image
                                title={doc.title} // Title of the doc
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
