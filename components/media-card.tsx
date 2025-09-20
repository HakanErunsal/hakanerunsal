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
    <div
      className={`group relative mt-2 w-full cursor-pointer overflow-hidden border rounded-none shadow-md ${className}`}
      onClick={onClick}
      style={{ maxWidth: "1024px", minWidth: "256px", ...style }}
    >
      <Link href={"/" + slug}>
        {/* Fixed aspect ratio wrapper */}
        <div className="w-full aspect-[16/9] relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center px-4 py-2">
        <div className="text-md truncate">{title}</div>
      </div>
    </div>
  );
}

// Exporting MediaCard component
export default MediaCard;
