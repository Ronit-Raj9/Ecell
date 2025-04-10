'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Event } from '../../../../types/event';
import EventForm from '../../../../components/admin/EventForm';
import { motion } from 'framer-motion';

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (eventData: Partial<Event>) => {
    setIsSubmitting(true);
    
    // In a real application, this would be an API call to create the event
    console.log('Creating event:', eventData);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a new ID (in a real app, this would come from the backend)
      const newEvent = {
        ...eventData,
        id: `event-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Created event:', newEvent);
      
      // Redirect to events management page
      router.push('/admin/events');
    }, 1000);
  };
  
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
        
        <h1 className="text-3xl font-bold text-white">Create New Event</h1>
        <p className="text-white/70 mt-1">Fill in the form below to create a new event</p>
      </div>
      
      <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
} 