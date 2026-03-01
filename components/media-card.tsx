// Importing necessary modules and components
import Link from "next/link";
import Image from "next/image";

// Interface for MediaCardProps
interface MediaCardProps {
  slug: string;
  image: string;
  title: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  imagePosition?: string;
}

// MediaCard functional component
function MediaCard({ slug, image, title, onClick, className, style, imagePosition }: MediaCardProps) {
  return (
    <div
      className={`group relative mt-2 w-full cursor-pointer overflow-hidden border border-border/50 rounded-sm hover:border-primary/30 transition-all duration-200 ${className}`}
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
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ objectPosition: imagePosition || 'center' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white px-4 py-3 pt-8">
        <div className="text-sm font-heading font-medium truncate">{title}</div>
      </div>
    </div>
  );
}

// Exporting MediaCard component
export default MediaCard;
