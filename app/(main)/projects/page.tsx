// Importing necessary modules and components
import { sortProjects } from "@/lib/utils"; // Importing utility functions from utils module
import { projects } from "#site/content"; // Importing posts data from content
import MediaCard from "@/components/media-card"; // Importing MediaCard component

// Home functional component
export default function Home() {
  // Sorting and selecting latest posts
  const latestProjects = sortProjects(projects).slice(0, 20);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {/* Left column */}
      <div className=""></div>
      {/* Right column */}
      <div className="col-span-2 mt-4 md:mt-0 mr-0 md:mr-8">
        {/* Hero section */}
        <div className="flex flex-col justify-center items-center md:items-end lg:items-center h-80 p-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Projects
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-mono">
            Things I&apos;ve built & shipped
          </p>
        </div>

        <hr className="size-5 border-gray-600 w-full" />

        {/* Grid for displaying latest posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mapping over latest posts and rendering MediaCard for each */}
          {latestProjects.map((project) => (
            <div key={project.slug}>
              {/* MediaCard component */}
              <MediaCard
                slug={project.slug} // Slug of the post
                image={project.image?.src || ''} // URL of the post image
                title={project.title} // Title of the post
                imagePosition={project.imagePosition} // Optional image positioning
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
