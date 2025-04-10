'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAdminGalleryOccasions,
  deleteGalleryOccasion,
  GalleryOccasion
} from '@/redux/slices/gallerySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, MoreHorizontal, ImageIcon, Calendar, Trash, Pencil, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import CloudinaryImage from '@/components/CloudinaryImage';

// Define the categories for our gallery
const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'activities', label: 'Club Activities' },
];

export default function AdminGalleryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { occasions, loading } = useSelector((state: RootState) => state.gallery);
  const [activeCategory, setActiveCategory] = useState('all');
  const [occasionToDelete, setOccasionToDelete] = useState<GalleryOccasion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load all occasions (including unpublished ones for admin)
    dispatch(fetchAdminGalleryOccasions({ category: activeCategory !== 'all' ? activeCategory : undefined }));
  }, [dispatch, activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleDeleteOccasion = async () => {
    if (occasionToDelete) {
      try {
        await dispatch(deleteGalleryOccasion(occasionToDelete._id));
        setOccasionToDelete(null);
        // Refresh the occasions list after deletion
        dispatch(fetchAdminGalleryOccasions({ category: activeCategory !== 'all' ? activeCategory : undefined }));
        toast({
          title: "Gallery Occasion Deleted",
          description: `"${occasionToDelete.title}" has been successfully deleted.`,
        });
      } catch (error) {
        console.error("Error deleting gallery occasion:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the gallery occasion. Please try again later.",
        });
      }
    }
  };

  // Filter occasions for the active category - but this is now handled by the API
  const filteredOccasions = occasions;

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
    <div className="space-y-8 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen pb-10 relative">
      {/* Floating action button - visible at all times */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
          asChild
        >
          <Link href="/dashboard/gallery/new">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create New Occasion</span>
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 py-8 px-4 md:px-6 border-b">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create and manage gallery occasions and photos.
              </p>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all" asChild>
              <Link href="/dashboard/gallery/new" className="flex items-center px-4 py-2">
                <Plus className="h-5 w-5 mr-2" />
                Create New Occasion
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
            <div className="p-4 md:p-6 border-b bg-gray-50 dark:bg-gray-800/50">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                {GALLERY_CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm py-2"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {GALLERY_CATEGORIES.map(category => (
              <TabsContent key={category.id} value={category.id} className="p-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="p-4 md:p-6">
                  {loading ? (
                    <div className="flex justify-center py-24">
                      <Loading />
                    </div>
                  ) : filteredOccasions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <ImageIcon className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Gallery Occasions</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                        {`You haven't created any ${category.id === 'all' ? '' : category.id} gallery occasions yet. Add your first one to showcase your events!`}
                      </p>
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all" asChild>
                        <Link href="/dashboard/gallery/new" className="flex items-center">
                          <Plus className="h-5 w-5 mr-2" />
                          Create Your First Occasion
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredOccasions.map((occasion) => (
                        <OccasionCard 
                          key={occasion._id} 
                          occasion={occasion} 
                          onDelete={() => setOccasionToDelete(occasion)}
                          getCategoryLabel={getCategoryLabel}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <AlertDialog open={!!occasionToDelete} onOpenChange={(open) => !open && setOccasionToDelete(null)}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Gallery Occasion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
              This will permanently delete &quot;{occasionToDelete?.title}&quot; and all associated photos. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteOccasion}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function OccasionCard({ 
  occasion, 
  onDelete,
  getCategoryLabel
}: { 
  occasion: GalleryOccasion;
  onDelete: () => void;
  getCategoryLabel: (category: string) => string;
}) {
  const router = useRouter();
  const defaultCoverImage = '/images/placeholder-gallery.jpg';
  const coverImageUrl = occasion.cover_image 
    ? occasion.cover_image
    : defaultCoverImage;

  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-700">
      <div className="h-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/90 hover:bg-white text-gray-900"
              onClick={() => router.push(`/dashboard/gallery/${occasion._id}`)}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Manage
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/90 hover:bg-white text-gray-900"
              onClick={() => router.push(`/gallery/${occasion._id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
        <CloudinaryImage
          src={coverImageUrl}
          alt={occasion.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {occasion.is_published ? (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-green-500/90 hover:bg-green-500 text-white px-2 py-1">
              Published
            </Badge>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="outline" className="bg-white/80 hover:bg-white border-gray-300 px-2 py-1">
              Draft
            </Badge>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="bg-black/50 hover:bg-black/60 text-white border-none px-2 py-1">
            {getCategoryLabel(occasion.category)}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-start justify-between gap-2 text-xl font-bold">
            {occasion.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/gallery/${occasion._id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/gallery/${occasion._id}`)}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Manage Photos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/gallery/edit/${occasion._id}`)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
          {format(new Date(occasion.date), 'MMM d, yyyy')}
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex-grow">
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
          {occasion.description}
        </p>
      </CardContent>
      <CardFooter className="pt-3 pb-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <span className="text-sm font-medium flex items-center gap-1.5">
          <ImageIcon className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {occasion.photo_count || 0} {occasion.photo_count === 1 ? 'photo' : 'photos'}
          </span>
        </span>
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5" asChild>
          <Link href={`/dashboard/gallery/${occasion._id}`}>Manage Photos</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 