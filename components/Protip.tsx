import { cn } from '@/lib/utils';
import { SparklesIcon } from 'lucide-react';

export const Protip = ({
  className,
  title,
  description,
}: {
  className?: string;
  title?: string;
  description: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-start gap-3 text-sm p-4 my-4 border border-border/50 border-l-4 border-l-primary bg-primary/5 rounded',
        className,
      )}
    >
      <SparklesIcon className="inline-block w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title ? <p className="m-0 text-base font-heading font-semibold text-foreground">{title}</p> : null}
        <p className="m-0 mt-1 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};
