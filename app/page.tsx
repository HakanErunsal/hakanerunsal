// Importing necessary modules and components
import { buttonVariants } from "@/components/ui/button"; // Importing buttonVariants utility function from button module
import { cn, sortProjects } from "@/lib/utils"; // Importing utility functions from utils module
import { projects } from "#site/content"; // Importing posts data from content
import Link from "next/link"; // Importing Link component from Next.js
import MediaCard from "@/components/media-card"; // Importing MediaCard component
import { Icons } from "@/components/icons";
import Image from 'next/image';

// Home functional component
export default function Home() {
  // Sorting and selecting latest posts
  const latestProjects = sortProjects(projects).slice(0,20);

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
                {latestProjects.length > 0 && (
              <Link href= {latestProjects[0].slug}
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-2xl font-mono p-0"
              )}
              >
                {latestProjects[0].title}
                <Image 
                  src={latestProjects[0].image? latestProjects[0].image.src : "/cover.jpg"}
                  alt="Description of the image" 
                  width={500}
                  height={500}
                />
              </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="size-8 border-gray-600 w-full" />

        {/* Grid for displaying latest posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mapping over latest posts and rendering MediaCard for each */}
          {latestProjects.map((project) => (
            <li key={project.slug}>
              {/* MediaCard component */}
              <MediaCard
                slug={project.slug} // Slug of the post
                image={project.image?.src || ''} // URL of the post image
                title={project.title} // Title of the post
              />
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}