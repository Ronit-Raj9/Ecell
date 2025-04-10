export interface Winner {
  id: string;
  name: string;
  position: string;
  prize: string;
  photoUrl?: string;
}

export interface EventHighlight {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface EventRegistration {
  status: 'open' | 'closed' | 'coming_soon';
  deadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  teamSize?: {
    min: number;
    max: number;
  };
  fees?: {
    amount: number;
    currency: string;
  };
  additionalInfo?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  category: string;
  banner: string;
  thumbnail: string;
  tags: string[];
  speakers?: {
    id: string;
    name: string;
    position: string;
    organization: string;
    bio: string;
    imageUrl: string;
  }[];
  registration: EventRegistration;
  winners?: Winner[];
  highlights?: EventHighlight[];
  gallery?: GalleryImage[];
  isPublished: boolean;
  isFeatured: boolean;
  registrations?: number;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 
  | 'Tech' 
  | 'Competition' 
  | 'Workshop' 
  | 'Hackathon' 
  | 'Seminar' 
  | 'Cultural' 
  | 'Other'; 