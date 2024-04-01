import React from 'react'; // Import React

import { Calendar } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Icons } from './icons';
import { cn } from '@/lib/utils';

interface NavigationButton {
  slug: string;
  title: string;
}

export function NavigationItem({
  slug,
  title,
}: NavigationButton) {
  return (
    <div>
      {/* Content goes here */}
      <Link href={slug} passHref>
        <span className={cn(
                buttonVariants({ variant: "link", size: "lg" }),
                "text-4xl font-mono bg-gray-800 rounded-none p-2"
              )}>
          <Icons.downRightArrow className="mr-2" style={{ height: 40, width: 40}} />
          {title}
        </span>
      </Link>
    </div>
  );
}
