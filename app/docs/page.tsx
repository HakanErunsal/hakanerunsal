// Importing necessary modules and components
import { buttonVariants } from "@/components/ui/button"; // Importing buttonVariants utility function from button module
import { cn, sortDocs } from "@/lib/utils"; // Importing utility functions from utils module
import { docs } from "#site/content"; // Importing docs data from content
import Link from "next/link"; // Importing Link component from Next.js
import MediaCard from "@/components/media-card"; // Importing MediaCard component
import { Icons } from "@/components/icons";

// Docs functional component
export default function DocsPage() {
    // Sorting and selecting published docs
    const publishedDocs = sortDocs(docs.filter(d => d.published)).slice(0, 20);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left column */}
            <div className=""></div>
            {/* Right column */}
            <div className="col-span-2 mt-4 md:mt-0 mr-0 md:mr-8">
                {/* Latest section */}
                {/* Title */}
                <div className="flex justify-center md:justify-end lg:justify-center items-center h-80 p-8 font-mono">
                    <div className="text-nowrap text-2xl">
                        Latest Documentation
                        <div className="flex items-center">
                            <Icons.downRightArrow
                                className="mr-2"
                                style={{ height: 40, width: 40 }}
                            />
                            <div className="inline-block">
                                {publishedDocs.length > 0 && (
                                    <Link href={publishedDocs[0].slug}
                                        className={cn(
                                            buttonVariants({ variant: "link" }),
                                            "text-2xl font-mono p-0"
                                        )}
                                    >
                                        {publishedDocs[0].title}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
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
