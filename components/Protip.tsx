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
        'flex flex-col text-sm p-6 bg-primary-100/30 dark:bg-purple-900/30 rounded-md',
        className,
      )}
    >
      {title ? <p className="m-0 text-lg font-semibold">{title}</p> : null}
      <p className="flex gap-1 items-center my-2">
        <SparklesIcon className="inline-block w-4 h-4 text-primary-500 dark:text-primary-400" />
        {description}
      </p>
    </div>
  );
};
