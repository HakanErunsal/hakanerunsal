// Importing necessary modules and components
import { Button, buttonVariants } from "@/components/ui/button"; // Importing buttonVariants utility function from button module
import { siteConfig } from "@/config/site"; // Importing siteConfig from site configuration
import { cn, sortPosts } from "@/lib/utils"; // Importing utility functions from utils module
import { posts, projects } from "#site/content"; // Importing posts data from content
import Link from "next/link"; // Importing Link component from Next.js
import { PostItem } from "@/components/post-item"; // Importing PostItem component
import MediaCard from "@/components/media-card"; // Importing MediaCard component
import { Icons } from "@/components/icons";
import NavigationColumn from "@/components/site-navigation-column";

// Home functional component
export default function Home() {
  // Sorting and selecting latest posts
  const latestPosts = sortPosts(posts).slice(0,20);

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
            Latest Project
            <div className="flex items-center">
              <Icons.downRightArrow
                className="mr-2"
                style={{ height: 40, width: 40}}
              />
              <div className="inline-block">
              <Link href= {latestPosts[0].slug}
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-2xl font-mono p-0"
              )}
              >
                {latestPosts[0].title}
              </Link>
              </div>
            </div>
          </div>
        </div>

        <hr className="size-5 border-gray-600 w-full" />

        {/* Grid for displaying latest posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mapping over latest posts and rendering MediaCard for each */}
          {latestPosts.map((post) => (
            <div key={post.slug}>
              {/* MediaCard component */}
              <MediaCard
                slug={post.slug} // Slug of the post
                imageUrl={post.image} // URL of the post image
                title={post.title} // Title of the post
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
