import { z } from 'zod';

// Validate gallery occasion creation/update
export const galleryOccasionValidator = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters long').max(1000, 'Description cannot exceed 1000 characters'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Date must be a valid date string'
  }),
  category: z.enum(['events', 'workshops', 'competitions', 'activities'], {
    errorMap: () => ({ message: 'Invalid category. Must be one of: events, workshops, competitions, or activities' })
  }),
  is_published: z.boolean().optional(),
});

// Validate photo upload
export const galleryPhotoUploadValidator = z.object({
  occasion_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid occasion ID format'),
  caption: z.string().max(200, 'Caption cannot exceed 200 characters').optional(),
});

// Validate photo update
export const galleryPhotoUpdateValidator = z.object({
  caption: z.string().max(200, 'Caption cannot exceed 200 characters').optional(),
  is_approved: z.boolean().optional(),
}); 