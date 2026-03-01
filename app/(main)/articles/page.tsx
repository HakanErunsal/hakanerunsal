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
        {/* Hero section */}
        <div className="flex flex-col justify-center items-center h-64 py-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            Articles
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Thoughts, tutorials & deep dives
          </p>
        </div>

        <hr className="border-border/50 mb-8" />

        {/* Grid for displaying latest posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
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
  );
}
