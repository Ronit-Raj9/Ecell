import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  createButtonText?: string;
  createButtonLink?: string;
}

export default function DashboardHeader({
  title,
  description,
  createButtonText,
  createButtonLink,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      
      {createButtonText && createButtonLink && (
        <Button asChild>
          <Link href={createButtonLink}>
            <PlusIcon className="h-4 w-4 mr-2" />
            {createButtonText}
          </Link>
        </Button>
      )}
    </div>
  );
} 