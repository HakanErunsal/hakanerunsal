import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DownloadSectionProps {
  title: string;
  points: string[];
  badgeLink: string;
  badgeImage: string;
  type?: 'default' | 'android' | 'ios';
}

export function DownloadSection({
  title,
  points,
  badgeLink,
  badgeImage,
  type = 'default',
  ...props
}: DownloadSectionProps) {
  return (
    <div
      className={cn(
        'my-6 items-start rounded-md border boder-l-4 p-4 w-full dark:max-w-none',
        {
          'border-green-900 bg-green-50 dark:prose': type === 'android',
          'border-blue-900 bg-blue-50 dark:prose': type === 'ios',
        }
      )}
      {...props}
    >
      <h2 className="text-left text-xl font-bold mb-4">{title}</h2>
      <ul className="list-disc pl-5 mb-4">
        {points.map((point, index) => (
          <li key={index} className="mb-2">{point}</li>
        ))}
      </ul>
      <div className="text-center mt-4">
        <a href={badgeLink} target="_blank" rel="noopener noreferrer">
          <img alt="Download badge" src={badgeImage} className="w-full max-w-xs mx-auto" />
        </a>
      </div>
    </div>
  );
}