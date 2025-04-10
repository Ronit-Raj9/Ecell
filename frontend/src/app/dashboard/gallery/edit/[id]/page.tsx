'use client';

import React, { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOccasionById, 
  updateGalleryOccasion 
} from '@/redux/slices/gallerySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import Loading from '@/components/Loading';

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title must not exceed 100 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .max(500, { message: 'Description must not exceed 500 characters' }),
  date: z.date({ required_error: 'A date is required' }),
  category: z.enum(['events', 'workshops', 'competitions', 'activities'], {
    required_error: 'Please select a category',
  }),
  is_published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PageParams {
  id: string;
}

interface EditGalleryOccasionPageProps {
  params: PageParams;
}

export default function EditGalleryOccasionPage({ params }: EditGalleryOccasionPageProps) {
  // Properly unwrap params using React.use() with type assertion
  const { id } = use(params as any) as PageParams;
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { currentOccasion, loading } = useSelector((state: RootState) => state.gallery);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOccasionById(id));
    }
  }, [dispatch, id]);

  // Default form values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Will be set when occasion is loaded
    defaultValues: {
      title: '',
      description: '',
      category: 'events',
      is_published: false,
    },
  });

  // Populate form when occasion data is loaded
  useEffect(() => {
    if (currentOccasion) {
      try {
        // Parse date string to Date object with error handling
        let occasionDate: Date;
        
        // Try different date parsing approaches
        try {
          occasionDate = parse(currentOccasion.date, 'yyyy-MM-dd', new Date());
        } catch (error) {
          // If parsing fails, try creating date directly
          occasionDate = new Date(currentOccasion.date);
          
          // Verify the date is valid
          if (isNaN(occasionDate.getTime())) {
            // If still invalid, use current date as fallback
            console.error('Invalid date format:', currentOccasion.date);
            occasionDate = new Date();
          }
        }
        
        form.reset({
          title: currentOccasion.title,
          description: currentOccasion.description,
          date: occasionDate,
          category: currentOccasion.category as 'events' | 'workshops' | 'competitions' | 'activities',
          is_published: currentOccasion.is_published,
        });
      } catch (error) {
        console.error('Error setting form values:', error);
        toast({
          title: 'Form Error',
          description: 'There was an error loading the occasion data.',
          variant: 'destructive',
        });
      }
    }
  }, [currentOccasion, form, toast]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Format the date safely
      let formattedDate: string;
      try {
        formattedDate = format(data.date, 'yyyy-MM-dd');
      } catch (error) {
        console.error('Date formatting error during submit:', error);
        // Fall back to ISO string and extract date portion
        formattedDate = new Date().toISOString().split('T')[0];
      }
      
      await dispatch(updateGalleryOccasion({
        id,
        title: data.title,
        description: data.description,
        date: formattedDate,
        category: data.category,
        is_published: data.is_published,
      })).unwrap();
      
      toast({
        title: 'Gallery occasion updated',
        description: 'The occasion details have been successfully updated.',
        variant: 'default',
      });
      
      // Return to the gallery management page
      router.push('/dashboard/gallery');
    } catch (error) {
      toast({
        title: 'Failed to update gallery occasion',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  // If no occasion is found
  if (!currentOccasion && !loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Gallery Occasion Not Found</h1>
        <p className="mb-8">The gallery occasion you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/gallery')}>Back to Gallery Management</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/dashboard/gallery" className="inline-flex items-center text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Gallery Management
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Edit Gallery Occasion</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update the details of the gallery occasion.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="border-b">
          <CardTitle>Occasion Details</CardTitle>
          <CardDescription>
            Edit the information about this gallery occasion.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-16 relative">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Annual E-Cell Summit 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe what this occasion was about..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal w-full",
                                !field.value && "text-muted-foreground",
                                "border-gray-300"
                              )}
                            >
                              {field.value ? (
                                (() => {
                                  try {
                                    return format(field.value, "PPP");
                                  } catch (e) {
                                    console.error("Date formatting error:", e);
                                    return "Select a date";
                                  }
                                })()
                              ) : (
                                <span>Select a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="workshops">Workshops</SelectItem>
                          <SelectItem value="competitions">Competitions</SelectItem>
                          <SelectItem value="activities">Club Activities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Publish Status
                      </FormLabel>
                      <FormDescription>
                        If toggled on, this occasion will be visible on the public gallery.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Action Buttons - Fixed at the bottom */}
              <div className="flex justify-end gap-4 pt-4 mt-8 border-t fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 p-4 shadow-md z-50 md:absolute md:shadow-none md:left-6 md:right-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push('/dashboard/gallery')}
                  className="px-5 py-2 h-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-2.5 h-auto bg-primary hover:bg-primary/90 text-white font-medium text-base shadow-sm"
                >
                  {isSubmitting ? 'Updating...' : 'Update Occasion'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 