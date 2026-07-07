import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

interface ReviewItem {
  /** Optional short headline for the review. */
  title?: string;
  /** The review body text. */
  quote: string;
  /** Star rating out of 5. Defaults to 5. */
  rating?: number;
}

interface ReviewsProps {
  items: ReviewItem[];
  className?: string;
  /** Attribution line shown under the grid. Set to null/"" to hide. */
  source?: string | null;
  /** Optional link for the attribution line (e.g. the marketplace listing). */
  sourceHref?: string;
}

export default function Reviews({
  items,
  className,
  source = "Verified reviews from the Fab Marketplace listing",
  sourceHref,
}: ReviewsProps) {
  return (
    <div className={cn("my-8", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const rating = item.rating ?? 5;
          return (
            <figure
              key={i}
              className="flex flex-col rounded-lg border border-border/50 border-l-4 border-l-primary bg-primary/5 p-5"
            >
              <Quote
                className="mb-3 h-5 w-5 flex-shrink-0 text-primary/60"
                aria-hidden
              />
              {item.title ? (
                <figcaption className="mb-2 font-heading text-base font-semibold text-foreground">
                  {item.title}
                </figcaption>
              ) : null}
              <blockquote className="m-0 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.quote}
              </blockquote>
              <div
                className="mt-4 flex items-center gap-0.5"
                aria-label={`${rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-4 w-4",
                      s < rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                    aria-hidden
                  />
                ))}
              </div>
            </figure>
          );
        })}
      </div>
      {source ? (
        <p className="mt-3 text-center text-xs text-muted-foreground/70">
          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-primary hover:underline"
            >
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      ) : null}
    </div>
  );
}
