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
    <div className="grid grid-cols-1 lg:grid-cols-12">
      {/* Left column */}
      <div className="col-span-2">
        <NavigationColumn></NavigationColumn>
      </div>

      {/* Right column */}
      <div className="col-span-9 lg:col-span-10 p-10 pt-0">
        {/* Latest section */}
        {/* Title */}

        <div className="flex justify-center text-3xl font-black text-start lg:h-[250px] sm:pt-12">
          <div className="absolute z-10">
            <img
              src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
              alt="Logo"
              className="bg-auto md:bg-contain w-full h-[200px]"
            />
          </div>
          <div className="z-20">
            Latest Project
            <div className="flex">
              <Icons.downRightArrow
                className=""
                style={{ height: 12, width: 12 }}
              />
              <Link className="mt-12" href={"/"}>
                asdasd
              </Link>
            </div>
          </div>
        </div>

        <hr className="size-5 border-gray-600 w-full" />

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
