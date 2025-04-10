'use client';

import React, { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOccasionById, GalleryPhoto } from '@/redux/slices/gallerySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CloudinaryImage from '@/components/CloudinaryImage';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, ImageIcon, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PageParams {
  id: string;
}

interface GalleryOccasionPageProps {
  params: PageParams;
}

export default function GalleryOccasionPage({ params }: GalleryOccasionPageProps) {
  const { id } = use(params as any) as PageParams;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentOccasion, photos, loading } = useSelector((state: RootState) => state.gallery);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOccasionById(id));
    }
  }, [dispatch, id]);

  const handleOpenPhotoDetail = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhotoDetail = () => {
    setSelectedPhoto(null);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(photo => photo._id === selectedPhoto._id);
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(photo => photo._id === selectedPhoto._id);
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  // Handle keyboard navigation for photo modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto) {
        if (e.key === 'ArrowRight') {
          handleNextPhoto();
        } else if (e.key === 'ArrowLeft') {
          handlePrevPhoto();
        } else if (e.key === 'Escape') {
          handleClosePhotoDetail();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  // If no occasion is found
  if (!currentOccasion) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="bg-primary/10 p-4 rounded-full inline-flex mb-6">
          <ImageIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Gallery Not Found</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The gallery you're looking for doesn't exist, has been removed, or is not published yet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/gallery')} className="bg-primary hover:bg-primary/90">
            Browse All Galleries
          </Button>
          {user?.role === 'admin' || user?.role === 'superadmin' ? (
            <Button onClick={() => router.push('/dashboard/gallery')} variant="outline">
              Manage Galleries
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const categories = {
      events: 'Events',
      workshops: 'Workshops',
      competitions: 'Competitions',
      activities: 'Club Activities',
    };
    return categories[category as keyof typeof categories] || category;
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/gallery" className="inline-flex items-center text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Gallery
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentOccasion.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(currentOccasion.date), 'MMMM d, yyyy')}
          </div>
          
          <div className="flex items-center">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {getCategoryLabel(currentOccasion.category)}
            </span>
          </div>
          
          {currentOccasion.created_by && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Added by {currentOccasion.created_by.name}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
          {currentOccasion.description}
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No photos yet</h3>
          <p className="mt-1 text-gray-500">
            There are no photos in this gallery yet.
          </p>
        </div>
      ) : (
        <div className="masonry-grid">
          {photos.map((photo, index) => (
            <div 
              key={photo._id} 
              className="masonry-item mb-4"
            >
              <div 
                className="gallery-card group relative rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                onClick={() => handleOpenPhotoDetail(photo)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenPhotoDetail(photo);
                  }
                }}
              >
                <div className="relative aspect-[3/4] w-full">
                  <CloudinaryImage 
                    src={photo.image_url} 
                    alt={photo.caption || 'Gallery photo'}
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
                    priority={index < 4}
                  />
                  
                  {/* Caption overlay at bottom */}
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 pt-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium line-clamp-2">{photo.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Detail Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && handleClosePhotoDetail()}>
        <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-black rounded-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex h-[85vh]">
            <div className="flex-1 relative">
              <CloudinaryImage
                src={selectedPhoto?.image_url || ''}
                alt={selectedPhoto?.caption || 'Gallery photo'}
                fill
                className="object-contain"
              />
              
              {/* Close button */}
              <button 
                onClick={handleClosePhotoDetail} 
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          {selectedPhoto && selectedPhoto.caption && (
            <div className="bg-black/90 p-4 absolute bottom-0 left-0 right-0">
              <p className="text-white text-base">
                {selectedPhoto.caption}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 