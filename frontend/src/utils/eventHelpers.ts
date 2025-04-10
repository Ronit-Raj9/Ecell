import { format, isFuture, isPast } from 'date-fns';
import { Event } from '@/types/event';

/**
 * Format the event date for display
 */
export function formatEventDate(date: string | Date, includeTime: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (includeTime) {
    return format(dateObj, 'MMMM d, yyyy h:mm a');
  }
  
  return format(dateObj, 'MMMM d, yyyy');
}

/**
 * Check if an event is upcoming
 */
export function isUpcomingEvent(event: Event): boolean {
  return isFuture(new Date(event.date));
}

/**
 * Check if an event is past
 */
export function isPastEvent(event: Event): boolean {
  return isPast(new Date(event.date));
}

/**
 * Get the registration status text
 */
export function getRegistrationStatusText(event: Event): string {
  const { registration } = event;
  
  switch (registration.status) {
    case 'open':
      return 'Registration Open';
    case 'closed':
      return 'Registration Closed';
    case 'coming_soon':
      return 'Coming Soon';
    default:
      return 'Registration Status Unknown';
  }
}

/**
 * Get the registration button text
 */
export function getRegistrationButtonText(event: Event): string {
  const { registration } = event;
  
  switch (registration.status) {
    case 'open':
      return 'Register Now';
    case 'closed':
      if (isPastEvent(event)) {
        return 'Event Ended';
      }
      return 'Registration Closed';
    case 'coming_soon':
      return 'Coming Soon';
    default:
      return 'Learn More';
  }
}

/**
 * Sort events by date (newest first)
 */
export function sortEventsByDate(events: Event[], ascending: boolean = false): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Filter events by category
 */
export function filterEventsByCategory(events: Event[], category: string): Event[] {
  if (category === 'all') {
    return events;
  }
  
  return events.filter(event => event.category === category);
}

/**
 * Get upcoming events
 */
export function getUpcomingEvents(events: Event[]): Event[] {
  return events.filter(isUpcomingEvent).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

/**
 * Get past events
 */
export function getPastEvents(events: Event[]): Event[] {
  return events.filter(isPastEvent).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get featured events
 */
export function getFeaturedEvents(events: Event[]): Event[] {
  return events.filter(event => event.isFeatured);
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export const getEventTimeRemaining = (dateString: string): { days: number; hours: number; minutes: number } => {
  const eventDate = new Date(dateString).getTime();
  const now = new Date().getTime();
  
  const difference = eventDate - now;
  
  // Return 0 if the event has already occurred
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};

/**
 * Format the event time for display
 */
export function formatEventTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'h:mm a');
} 