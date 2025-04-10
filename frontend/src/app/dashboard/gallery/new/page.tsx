'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGalleryOccasion } from '@/redux/slices/gallerySlice';
import { AppDispatch } from '@/redux/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { CalendarIcon, ChevronLeft, PlusCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';

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

export default function CreateGalleryOccasionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default form values
  const defaultValues: Partial<FormValues> = {
    title: '',
    description: '',
    category: 'events',
    is_published: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure date is properly formatted as string
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      const result = await dispatch(createGalleryOccasion({
        title: data.title,
        description: data.description,
        date: formattedDate,
        category: data.category,
        is_published: data.is_published,
      })).unwrap();
      
      toast({
        title: 'Gallery occasion created',
        description: 'Now you can add photos to this occasion.',
        variant: 'default',
      });
      
      // Redirect to manage photos for this new occasion
      router.push(`/dashboard/gallery/${result.occasion._id}`);
    } catch (error) {
      toast({
        title: 'Failed to create gallery occasion',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-24">
      <div className="bg-white dark:bg-gray-800 py-6 px-4 md:px-6 border-b mb-8">
        <div className="container mx-auto max-w-3xl">
          <Link href="/dashboard/gallery" className="inline-flex items-center text-primary hover:underline mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Gallery Management
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Gallery Occasion</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add a new event, workshop, competition, or activity to your gallery.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
            <CardTitle>Occasion Details</CardTitle>
            <CardDescription>
              Fill out the information about this gallery occasion.
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Annual E-Cell Summit 2023" {...field} className="h-10" />
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
                      <FormLabel className="text-base font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe what this occasion was about..." 
                          className="min-h-[100px] resize-y"
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
                        <FormLabel className="text-base font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-10 pl-3 text-left font-normal border-gray-300 dark:border-gray-600",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
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
                        <FormLabel className="text-base font-medium">Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">
                          Publish Immediately
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
              </CardContent>
              
              {/* Fixed action bar at the bottom */}
              <div className="sticky bottom-0 left-0 right-0 z-20">
                <CardFooter className="flex justify-between py-4 px-6 bg-white dark:bg-gray-800 border-t shadow-md">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                    onClick={() => router.push('/dashboard/gallery')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-2 h-10 font-medium"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Creating...' : 'Create Occasion'}
                  </Button>
                </CardFooter>
              </div>
            </form>
          </Form>
        </Card>
      </div>
      
      {/* Secondary fixed button for extra visibility */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="sr-only">Create Occasion</span>
        </Button>
      </div>
    </div>
  );
} 