// Importing necessary modules and components
import { Metadata } from "next";
import { sortProjects } from "@/lib/utils"; // Importing utility functions from utils module
import { projects } from "#site/content"; // Importing posts data from content
import MediaCard from "@/components/media-card"; // Importing MediaCard component
import { RigbakHome } from "@/components/rigbak-home";
import { isRigbak } from "@/lib/site-mode";
import { brandConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: isRigbak ? "Rigbak" : brandConfig.name,
  },
  description: brandConfig.description,
  alternates: {
    canonical: brandConfig.url,
  },
};

// Home functional component
export default function Home() {
  if (isRigbak) {
    return <RigbakHome />;
  }

  // Sorting and selecting latest posts
  const latestProjects = sortProjects(projects).slice(0, 20);

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="">
        {/* Hero section */}
        <div className="flex flex-col justify-center items-center md:items-end lg:items-center h-80 p-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Hakan Erunsal
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-mono">
            Game Developer & Technical Artist
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
                slug={project.slug}
                image={project.image?.src || ''}
                title={project.title}
                imagePosition={project.imagePosition}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
