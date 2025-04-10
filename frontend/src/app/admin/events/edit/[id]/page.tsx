'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Event } from '../../../../../types/event';
import EventForm from '../../../../../components/admin/EventForm';
import { events } from '../../../../../data/events';
import { motion } from 'framer-motion';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // In a real application, this would be an API call to get the event
    const eventId = params.id as string;
    const foundEvent = events.find(e => e.id === eventId);
    
    if (foundEvent) {
      setEvent(foundEvent);
    }
    
    setIsLoading(false);
  }, [params.id]);
  
  const handleSubmit = (eventData: Partial<Event>) => {
    setIsSubmitting(true);
    
    // In a real application, this would be an API call to update the event
    console.log('Updating event:', eventData);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Update the event
      const updatedEvent = {
        ...eventData,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Updated event:', updatedEvent);
      
      // Redirect to events management page
      router.push('/admin/events');
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading event details...</div>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Event Not Found</h2>
          <p className="text-white/70 mb-6">The event you are looking for does not exist or has been removed.</p>
          <Link href="/admin/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Return to Events
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link href="/admin/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/80 bg-white/5 hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Events
            </motion.button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-white">Edit Event</h1>
        <p className="text-white/70 mt-1">
          <span className="badge-gradient px-3 py-1 rounded-full text-xs font-medium mr-2">{event.category}</span>
          {event.title}
        </p>
      </div>
      
      <EventForm initialEvent={event} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
} 