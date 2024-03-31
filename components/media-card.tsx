// Importing necessary modules and components
import Link from "next/link";
import { cn } from "@/lib/utils";

// Interface for MediaCardProps
interface MediaCardProps {
    slug: string;       // Slug for the link
    imageUrl: string;   // URL of the image
    title: string;      // Title of the media card
    onClick?: () => void; // onClick event handler (optional)
}

// MediaCard functional component
function MediaCard({ slug, imageUrl, title, onClick }: MediaCardProps) {
  return (
    // Container for the media card with fixed aspect ratio
    <div
      // Styling classes for the container
      className="group relative mt-2 w-auto h-auto cursor-pointer overflow-hidden border"
      onClick={onClick} // onClick event handler
    >
      {/* Link wrapping the image */}
      <Link href={"/" + slug}>
        {/* Image */}
        <img
          // Image properties
          loading="lazy"
          src={imageUrl} // Image URL
          alt={title}    // Image alt text
          // Styling classes for the image
          className="object-cover w-full h-full overflow-hidden transition-transform duration-200 group-hover:scale-105"
        />
      </Link>
      {/* Title container */}
      <div className="title-container absolute bottom-0 left-0 right-0 bg-black text-white text-center px-10 py-2 overflow-hidden">
        <div className="text-md">
          {title} {/* Title text */}
        </div>
      </div>
    </div>
  );
}

// Exporting MediaCard component
export default MediaCard;
