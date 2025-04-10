import { z } from 'zod';

// Winners validation schema
const winnerSchema = z.object({
  name: z.string().min(1, 'Winner name is required'),
  position: z.string().min(1, 'Position is required'),
  prize: z.string().min(1, 'Prize is required'),
  photo_url: z.string().url('Invalid URL format').optional(),
  role: z.string().optional()
});

// Highlight validation schema
const highlightSchema = z.object({
  title: z.string().min(1, 'Highlight title is required'),
  description: z.string().min(1, 'Highlight description is required'),
  image_url: z.string().url('Invalid URL format').optional()
});

// Gallery image validation schema
const galleryImageSchema = z.object({
  url: z.string().url('Invalid URL format'),
  caption: z.string().optional()
});

// Create event validation
export const createEventValidator = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  short_description: z.string().min(10, 'Short description is required').max(150, 'Short description cannot exceed 150 characters'),
  date: z.string().or(z.date()),
  end_date: z.string().or(z.date()).optional(),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(2, 'Location is required'),
  venue: z.string().optional(),
  registration_link: z.string().url('Invalid URL format').optional(),
  category: z.string().min(1, 'Category is required'),
  event_type: z.enum(['upcoming', 'past'], {
    errorMap: () => ({ message: 'Event type must be either upcoming or past' })
  }),
  is_featured: z.boolean().optional(),
  is_new: z.boolean().optional(),
  is_popular: z.boolean().optional(),
  is_limited_seats: z.boolean().optional(),
  is_team_event: z.boolean().optional(),
  max_participants: z.number().optional(),
  show_participant_count: z.boolean().optional(),
  outcomes: z.string().optional(),
  rules: z.string().optional(),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().optional()
});

// Update event validation
export const updateEventValidator = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  short_description: z.string().min(10, 'Short description is required').max(150, 'Short description cannot exceed 150 characters').optional(),
  date: z.string().or(z.date()).optional(),
  end_date: z.string().or(z.date()).optional(),
  time: z.string().min(1, 'Time is required').optional(),
  location: z.string().min(2, 'Location is required').optional(),
  venue: z.string().optional(),
  registration_link: z.string().url('Invalid URL format').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  event_type: z.enum(['upcoming', 'past'], {
    errorMap: () => ({ message: 'Event type must be either upcoming or past' })
  }).optional(),
  is_featured: z.boolean().optional(),
  is_new: z.boolean().optional(),
  is_popular: z.boolean().optional(),
  is_limited_seats: z.boolean().optional(),
  is_team_event: z.boolean().optional(),
  max_participants: z.number().optional(),
  current_participants: z.number().optional(),
  show_participant_count: z.boolean().optional(),
  outcomes: z.string().optional(),
  event_highlights: z.string().optional(),
  rules: z.string().optional(),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().optional()
});

// Winner management validation
export const updateWinnersValidator = z.object({
  winners: z.array(winnerSchema).min(1, 'At least one winner must be provided')
});

// Event highlights validation
export const updateHighlightsValidator = z.object({
  highlights: z.array(highlightSchema).min(1, 'At least one highlight must be provided')
});

// Gallery upload validation
export const updateGalleryValidator = z.object({
  gallery: z.array(galleryImageSchema).min(1, 'At least one gallery image must be provided')
}); 