// Importing necessary modules and components
import { sortArticles } from "@/lib/utils"; // Importing utility functions from utils module
import { articles } from "#site/content"; // Importing posts data from content
import MediaCard from "@/components/media-card"; // Importing MediaCard component

// Home functional component
export default function Home() {
  // Sorting and selecting latest posts
  const latestArticles = sortArticles(articles.filter(a => a.published)).slice(0, 20);


  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="">
        {/* Hero section */}
        <div className="flex flex-col justify-center items-center md:items-end lg:items-center h-80 p-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Articles
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-mono">
            Thoughts, tutorials & deep dives
          </p>
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
