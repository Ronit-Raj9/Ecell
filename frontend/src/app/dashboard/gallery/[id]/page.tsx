'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOccasionById, 
  uploadGalleryPhoto, 
  deleteGalleryPhoto,
  updateGalleryPhoto,
  setOccasionCoverImage,
  updateGalleryOccasion,
  GalleryPhoto
} from '@/redux/slices/gallerySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import CloudinaryImage from '@/components/CloudinaryImage';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronLeft, Upload, Pencil, Trash, MoreHorizontal, Star, AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/Loading';
import { Separator } from '@/components/ui/separator';

interface PageParams {
  id: string;
}

interface ManageGalleryPhotosPageProps {
  params: PageParams;
}

export default function ManageGalleryPhotosPage({ params }: ManageGalleryPhotosPageProps) {
  const { id } = use(params as any) as PageParams;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { currentOccasion, photos, loading } = useSelector((state: RootState) => state.gallery);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhoto | null>(null);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState('');
  const [editPhotoId, setEditPhotoId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOccasionById(id));
    }
  }, [dispatch, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one photo to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a FormData object to send the files
      const formData = new FormData();
      formData.append('occasion_id', id);
      
      // Add all files to the formData
      for (let i = 0; i < uploadFiles.length; i++) {
        formData.append('photos', uploadFiles[i]);
      }
      
      // Add caption if provided
      if (caption) {
        formData.append('caption', caption);
      }

      console.log('Attempting to upload photos...');
      
      // Dispatch the upload action and unwrap the result
      const result = await dispatch(uploadGalleryPhoto({ formData, occasionId: id })).unwrap();
      
      console.log('Upload result:', result);
      
      // Check if the upload was successful
      if (result && (result.photo || Object.keys(result).length > 0)) {
        // Reset the form
        setUploadFiles(null);
        setCaption('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast({
          title: 'Upload successful',
          description: 'Photos have been uploaded successfully.',
          variant: 'default',
        });
      }
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload photos. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (photoToDelete) {
      try {
        await dispatch(deleteGalleryPhoto({
          photoId: photoToDelete._id,
          occasionId: id
        })).unwrap();
        
        setPhotoToDelete(null);
      } catch (error) {
        toast({
          title: 'Delete failed',
          description: error instanceof Error ? error.message : 'Failed to delete photo',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUpdateCaption = async () => {
    if (editPhotoId) {
      try {
        await dispatch(updateGalleryPhoto({
          photoId: editPhotoId,
          caption: editCaption,
          occasionId: id
        })).unwrap();
        
        setEditPhotoId(null);
        setEditCaption('');
        
        toast({
          title: 'Caption updated',
          description: 'Photo caption has been updated successfully.',
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Update failed',
          description: error instanceof Error ? error.message : 'Failed to update caption',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSetCoverImage = async (photoId: string) => {
    try {
      await dispatch(setOccasionCoverImage({
        occasionId: id,
        photoId
      })).unwrap();
      
      toast({
        title: 'Cover updated',
        description: 'Cover image has been updated successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to set cover image',
        variant: 'destructive',
      });
    }
  };

  const handlePublishOccasion = async () => {
    if (!currentOccasion) return;
    
    try {
      await dispatch(updateGalleryOccasion({
        id: currentOccasion._id,
        is_published: true
      })).unwrap();
      
      toast({
        title: 'Gallery published',
        description: 'The gallery is now visible to all users.',
        variant: 'default',
      });
      
      // Refresh occasion data
      dispatch(fetchOccasionById(id));
    } catch (error) {
      toast({
        title: 'Failed to publish gallery',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  // Show photo detail
  const handleOpenPhotoDetail = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhotoDetail = () => {
    setSelectedPhoto(null);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto || photos.length <= 1) return;
    
    const currentIndex = photos.findIndex(photo => photo._id === selectedPhoto._id);
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    } else {
      // Loop back to the first photo
      setSelectedPhoto(photos[0]);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto || photos.length <= 1) return;
    
    const currentIndex = photos.findIndex(photo => photo._id === selectedPhoto._id);
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    } else {
      // Loop to the last photo
      setSelectedPhoto(photos[photos.length - 1]);
    }
  };

  // Add keyboard navigation for photo viewer
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
  }, [selectedPhoto, photos]);

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
        <h1 className="text-3xl font-bold mb-4">Gallery Occasion Not Found</h1>
        <p className="mb-8">The gallery occasion you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/gallery')}>Back to Gallery Management</Button>
      </div>
    );
  }

  // Component for drag and drop file upload
  const DragDropUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileCount, setFileCount] = useState(0);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        setUploadFiles(e.dataTransfer.files);
        setFileCount(e.dataTransfer.files.length);
      }
    };

    const handleClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const updateFileCount = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFileCount(e.target.files.length);
      }
    };

    return (
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer text-center
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="text-lg font-medium mb-1">Drag and drop your photos here</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to select files from your computer
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              handleFileChange(e);
              updateFileCount(e);
            }}
            className="hidden"
            multiple
            accept="image/jpeg,image/png,image/webp"
          />
          {fileCount > 0 && (
            <Badge variant="secondary" className="text-sm py-1.5 px-3">
              {fileCount} file{fileCount > 1 ? 's' : ''} selected
            </Badge>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Supported formats: JPG, PNG, WebP. Maximum size: 5MB per photo.
          </p>
        </div>
      </div>
    );
  };

  // Preview selected images
  const ImagePreview = () => {
    if (!uploadFiles || uploadFiles.length === 0) return null;
    
    const previewUrls = [];
    for (let i = 0; i < uploadFiles.length; i++) {
      previewUrls.push(URL.createObjectURL(uploadFiles[i]));
    }
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Selected Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
              <Image 
                src={url} 
                alt={`Preview ${index + 1}`} 
                fill 
                className="object-cover" 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

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
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4" 
              onClick={() => router.push('/dashboard/gallery')}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Gallery Management
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold truncate">{currentOccasion.title}</h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Badge className="mr-2 capitalize">{currentOccasion.category}</Badge>
                <span>{format(new Date(currentOccasion.date), 'MMMM d, yyyy')}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {!currentOccasion.is_published && (
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handlePublishOccasion}
                >
                  Publish Gallery
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => router.push(`/gallery/${id}`)}
              >
                View Gallery
            </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/dashboard/gallery/edit/${id}`)}
              >
                Edit Details
            </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="photos">
              Photos {photos.length > 0 && `(${photos.length})`}
            </TabsTrigger>
          <TabsTrigger value="upload">Upload Photos</TabsTrigger>
        </TabsList>
        
          <TabsContent value="photos" className="space-y-6">
          {photos.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  This gallery doesn't have any photos yet. You can upload photos from the "Upload Photos" tab.
                </p>
                <Button variant="default" onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
                  Upload Photos
              </Button>
            </div>
          ) : (
              <div className="masonry-grid">
                {photos.map((photo) => (
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
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {/* Cover image badge */}
                        {currentOccasion.cover_image && photo.image_url === currentOccasion.cover_image && (
                          <div className="absolute top-3 left-3 bg-primary text-white text-xs py-1 px-3 rounded-full shadow-sm z-10 backdrop-blur-sm bg-opacity-80">
                            Cover
                          </div>
                        )}
                        
                        {/* Caption overlay at bottom */}
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 pt-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm font-medium line-clamp-2">{photo.caption}</p>
                          </div>
                        )}
                        
                        {/* Overlay with actions */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            className="bg-white text-black hover:bg-gray-100 shadow-lg rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPhotoDetail(photo);
                            }}
                          >
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                className="bg-white text-black hover:bg-gray-100 shadow-lg rounded-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setEditPhotoId(photo._id);
                                setEditCaption(photo.caption || '');
                              }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Caption
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleSetCoverImage(photo._id);
                              }}>
                                <Star className="mr-2 h-4 w-4" />
                                Set as Cover
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPhotoToDelete(photo);
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          )}
        </TabsContent>
        
          <TabsContent value="upload" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Upload Photos to Gallery</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="photos" className="mb-2 block">Select Photos</Label>
                  <DragDropUpload />
                  <ImagePreview />
                </div>

                <div>
                  <Label htmlFor="caption" className="mb-2 block">Caption (Optional)</Label>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption for the uploaded photos..."
                    className="resize-none"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This caption will be applied to all photos in this upload. You can edit individual captions later.
                  </p>
                  <div className="text-right text-xs text-gray-500">
                    {caption.length}/500 characters
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
                    After selecting files, click the "Upload Photos" button below to complete the upload.
                  </p>
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading || !uploadFiles} 
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photos
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
        </TabsContent>
      </Tabs>
      </div>

      {/* Photo detail dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && handleClosePhotoDetail()}>
        <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-black rounded-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col md:flex-row h-[85vh]">
            <div className="flex-1 relative">
              {selectedPhoto && (
                <CloudinaryImage
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.caption || 'Gallery photo'}
                  fill
                  className="object-contain"
                />
              )}
              
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
            
            <div className="w-full md:w-96 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl">Photo Details</DialogTitle>
              </DialogHeader>
              
              {selectedPhoto && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Caption</h4>
                    <p className="text-gray-800 dark:text-gray-200 text-base">
                      {selectedPhoto.caption || 'No caption'}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Uploaded by</h4>
                    <p className="text-gray-800 dark:text-gray-200 flex items-center">
                      <span className="inline-block h-6 w-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2">
                        {selectedPhoto.uploaded_by.name.charAt(0)}
                      </span>
                      {selectedPhoto.uploaded_by.name}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Upload date</h4>
                    <p className="text-gray-800 dark:text-gray-200 flex items-center">
                      <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      {format(new Date(selectedPhoto.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  
                  {currentOccasion.cover_image !== selectedPhoto.image_url && (
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleSetCoverImage(selectedPhoto._id)}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Set as Cover Image
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3 pt-2">
                    <Button 
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setEditPhotoId(selectedPhoto._id);
                        setEditCaption(selectedPhoto.caption || '');
                        handleClosePhotoDetail();
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Caption
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      className="justify-start"
                      onClick={() => {
                        setPhotoToDelete(selectedPhoto);
                        handleClosePhotoDetail();
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit caption dialog */}
      <Dialog open={!!editPhotoId} onOpenChange={(open) => !open && setEditPhotoId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Caption</DialogTitle>
            <DialogDescription>
              Update the caption for this photo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Enter a caption for this photo..."
              rows={4}
            />
            <div className="text-right text-xs text-gray-500">
              {editCaption.length}/500 characters
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPhotoId(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCaption}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 