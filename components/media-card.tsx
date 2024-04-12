// Importing necessary modules and components
import Link from "next/link";
import Image from "next/image";

// Interface for MediaCardProps
interface MediaCardProps {
  slug: string; // Slug for the link
  image: string; // URL of the image
  title: string; // Title of the media card
  onClick?: () => void; // onClick event handler (optional)
  className?: string; // Additional class names for the container
  style?: React.CSSProperties; // Additional inline styles for the container
}

// MediaCard functional component
function MediaCard({ slug, image, title, onClick, className, style }: MediaCardProps) {
  return (
    // Container for the media card with fixed aspect ratio
    <div
      // Styling classes for the container
      className={`group relative mt-2 w-auto h-auto cursor-pointer overflow-hidden border rounded-none shadow-md ${className}`}
      onClick={onClick} // onClick event handler
      style={{ maxWidth: "1024px", maxHeight: "512px", minWidth: "256px", ...style }} // Custom styles
    >
      {/* Link wrapping the image */}
      <Link href={"/" + slug}>{title}
        {/* Image */}
        <Image
          // Image properties
          width={1000}
          height={1000}
          src={image} // Image URL
          alt={title} // Image alt text
          className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
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
