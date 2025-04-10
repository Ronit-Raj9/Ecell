'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchGalleryOccasions, 
  GalleryOccasion
} from '@/redux/slices/gallerySlice';
import { AppDispatch, RootState } from '@/redux/store';
import Image from 'next/image';
import CloudinaryImage from '@/components/CloudinaryImage';
import Link from 'next/link';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Image as ImageIcon, } from 'lucide-react';
import { cn } from '@/lib/utils';
import Loading from '@/components/Loading';

// Define the categories for our gallery
const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'activities', label: 'Club Activities' },
];

export default function GalleryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { occasions, loading } = useSelector((state: RootState) => state.gallery);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Initial load of all occasions
    dispatch(fetchGalleryOccasions({}));
  }, [dispatch]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    // If the category is 'all', fetch without filter
    if (category === 'all') {
      dispatch(fetchGalleryOccasions({}));
    } else {
      dispatch(fetchGalleryOccasions({ category }));
    }
  };

  // Filter occasions for the active category
  const filteredOccasions = activeCategory === 'all' 
    ? occasions 
    : occasions.filter(occasion => occasion.category === activeCategory);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">E-Cell Gallery</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A glimpse into our events, workshops, competitions, and activities.
        </p>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          {GALLERY_CATEGORIES.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {GALLERY_CATEGORIES.map(category => (
          <TabsContent key={category.id} value={category.id}>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loading />
              </div>
            ) : filteredOccasions.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No photos yet</h3>
                <p className="mt-1 text-gray-500">
                  {`We don't have any ${category.id === 'all' ? 'gallery' : category.id} photos to display yet.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOccasions.map((occasion) => (
                  <OccasionCard key={occasion._id} occasion={occasion} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function OccasionCard({ occasion }: { occasion: GalleryOccasion }) {
  const defaultCoverImage = '/images/placeholder-gallery.jpg';
  
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
      <Link href={`/gallery/${occasion._id}`} className="block overflow-hidden h-48 relative">
        <CloudinaryImage
          src={occasion.cover_image || defaultCoverImage}
          alt={occasion.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start justify-between gap-2">
          <Link href={`/gallery/${occasion._id}`} className="hover:text-primary transition-colors">
            {occasion.title}
          </Link>
        </CardTitle>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          {format(new Date(occasion.date), 'MMM d, yyyy')}
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex-grow">
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
          {occasion.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {occasion.photo_count || 0} {occasion.photo_count === 1 ? 'photo' : 'photos'}
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/gallery/${occasion._id}`}>View Gallery</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 