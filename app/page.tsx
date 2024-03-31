// Importing necessary modules and components
import { Button, buttonVariants } from "@/components/ui/button"; // Importing buttonVariants utility function from button module
import { siteConfig } from "@/config/site"; // Importing siteConfig from site configuration
import { cn, sortPosts } from "@/lib/utils"; // Importing utility functions from utils module
import { posts } from "#site/content"; // Importing posts data from content
import Link from "next/link"; // Importing Link component from Next.js
import { PostItem } from "@/components/post-item"; // Importing PostItem component
import MediaCard from "@/components/media-card"; // Importing MediaCard component
import { Icons } from "@/components/icons";
import NavigationColumn from "@/components/site-navigation-column";

// Home functional component
export default function Home() {
  // Sorting and selecting latest posts
  const latestPosts = sortPosts(posts).slice(0, 20);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6  grid-flow-col">

      {/* Left column */}
      <div className="col-span-1">
        <NavigationColumn></NavigationColumn>
      </div>
    

      {/* Right column */}
      <div className="col-span-3 lg:col-span-4 p-10 pt-60">
        {/* Latest section */}
          {/* Title */}
          <div className="text-3xl font-black text-start">
            Latest Project
            <Icons.downRightArrow className="" style={{height: 12, width: 12}}/>
          </div>
          {/* Grid for displaying latest posts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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