import Image from 'next/image';
import { useState } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  className = '',
  onClick,
  priority = false,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle empty or invalid src
  if (!src) {
    console.warn('CloudinaryImage: Empty src provided');
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        style={fill ? { position: 'absolute', inset: 0 } : { width: width || 300, height: height || 200 }}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">Image not available</span>
      </div>
    );
  }

  // Check if the image is already a Cloudinary URL
  const isCloudinaryUrl = src.includes('cloudinary.com');

  // If it's not a Cloudinary URL or is a local path, use it as is
  if (!isCloudinaryUrl || src.startsWith('/')) {
    return (
      <div className="relative" style={fill ? { width: '100%', height: '100%' } : {}}>
        {isLoading && (
          <div 
            className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
            style={fill ? { position: 'absolute', inset: 0 } : {}}
          />
        )}
        {hasError ? (
          <div 
            className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
            style={fill ? { position: 'absolute', inset: 0 } : { width: width || 300, height: height || 200 }}
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            sizes={sizes}
            className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onClick={onClick}
            priority={priority}
            quality={quality}
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
          />
        )}
      </div>
    );
  }

  // Extract the Cloudinary part of the URL
  const getOptimizedUrl = () => {
    try {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
      const urlParts = src.split('/upload/');
      if (urlParts.length !== 2) return src;

      // Add optimization parameters
      const transformations = [
        'f_auto', // auto format
        'q_auto', // auto quality
      ];

      if (width && !fill) transformations.push(`w_${width}`);
      if (height && !fill) transformations.push(`h_${height}`);
      if (quality !== 80) transformations.push(`q_${quality}`);

      // Construct the final URL
      return `${urlParts[0]}/upload/${transformations.join(',')}/` + urlParts[1];
    } catch (error) {
      console.error('Error optimizing Cloudinary URL:', error);
      return src;
    }
  };

  return (
    <div className="relative" style={fill ? { width: '100%', height: '100%' } : {}}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={fill ? { position: 'absolute', inset: 0 } : {}}
        />
      )}
      {hasError ? (
        <div 
          className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
          style={fill ? { position: 'absolute', inset: 0 } : { width: width || 300, height: height || 200 }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</span>
        </div>
      ) : (
        <Image
          src={getOptimizedUrl()}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onClick={onClick}
          priority={priority}
          quality={quality}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      )}
    </div>
  );
} 