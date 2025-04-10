import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Loading({ size = 'medium' }: LoadingProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent border-primary animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
} 