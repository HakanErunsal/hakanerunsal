// Importing necessary modules and components
import { buttonVariants } from "@/components/ui/button"; // Importing buttonVariants utility function from button module
import { cn, sortArticles } from "@/lib/utils"; // Importing utility functions from utils module
import { articles } from "#site/content"; // Importing posts data from content
import Link from "next/link"; // Importing Link component from Next.js
import MediaCard from "@/components/media-card"; // Importing MediaCard component
import { Icons } from "@/components/icons";

// Home functional component
export default function Home() {
  // Sorting and selecting latest posts
  const latestArticles = sortArticles(articles).slice(0, 20);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {/* Left column */}
      <div className=""></div>
      {/* Right column */}
      <div className="col-span-2 mt-4 md:mt-0">
        {/* Latest section */}
        {/* Title */}
        <div className="flex justify-center items-center h-80 p-8 font-mono">
          <div className="text-nowrap text-2xl">
            Latest Article
            <div className="flex items-center">
              <Icons.downRightArrow
                className="mr-2"
                style={{ height: 40, width: 40}}
              />
              <div className="inline-block">
              {latestArticles.length > 0 && (
              <Link href= {latestArticles[0].slug}
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-2xl font-mono p-0"
              )}
              >
                {latestArticles[0].title}
              </Link>
              )}
              </div>
            </div>
          </div>
        </div>

        <hr className="size-5 border-gray-600 w-full" />

        {/* Grid for displaying latest posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mapping over latest posts and rendering MediaCard for each */}
          {latestArticles.map((article) => (
            <div key={article.slug}>
              {/* MediaCard component */}
              <MediaCard
                slug={article.slug} // Slug of the post
                image={article.image?.src || ''} // URL of the post image
                title={article.title} // Title of the post
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
