'use client';

import { useState } from 'react';
import Link from 'next/link';
import { events } from '@/data/events';
import EventsTable from '@/components/admin/EventsTable';
import { Event } from '@/types/event';
import { getUpcomingEvents } from '@/utils/eventHelpers';
import { motion } from 'framer-motion';

export default function AdminEventsPage() {
  const [eventsData, setEventsData] = useState<Event[]>(events);
  
  const handleDeleteEvent = (id: string) => {
    // This would typically be an API call in a real application
    setEventsData(prev => prev.filter(event => event.id !== id));
  };
  
  const publishedEvents = eventsData.filter(event => event.isPublished);
  const draftEvents = eventsData.filter(event => !event.isPublished);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-white/70 mt-1">Create, edit, and manage events for your organization</p>
        </div>
        
        <div className="flex space-x-3">
          <Link href="/admin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/80 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Dashboard
            </motion.button>
          </Link>
          
          <Link href="/admin/events/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create New Event
            </motion.button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-sm">Total Events</p>
              <h3 className="text-3xl font-bold text-white mt-1">{eventsData.length}</h3>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
                <path d="M8 14h.01"/>
                <path d="M12 14h.01"/>
                <path d="M16 14h.01"/>
                <path d="M8 18h.01"/>
                <path d="M12 18h.01"/>
                <path d="M16 18h.01"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-sm">Published</p>
              <h3 className="text-3xl font-bold text-white mt-1">{publishedEvents.length}</h3>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M9 12l2 2 4-4"/>
                <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-sm">Drafts</p>
              <h3 className="text-3xl font-bold text-white mt-1">{draftEvents.length}</h3>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-sm">Upcoming</p>
              <h3 className="text-3xl font-bold text-white mt-1">{getUpcomingEvents(eventsData).length}</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
                <circle cx="17" cy="7" r="5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-5">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/events/new">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Create Event</h4>
                    <p className="text-white/60 text-sm">Add a new event</p>
                  </div>
                </div>
              </motion.div>
            </Link>
            
            <Link href="/events">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" x2="21" y1="14" y2="3"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">View Events</h4>
                    <p className="text-white/60 text-sm">Public events page</p>
                  </div>
                </div>
              </motion.div>
            </Link>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                    <path d="M12 3v6"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Registrations</h4>
                  <p className="text-white/60 text-sm">{eventsData.reduce((acc, event) => acc + (event.registrations || 0), 0)} total</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <path d="M12 20v-6M16 20v-4M8 20v-2M19 7v2a3 3 0 0 1-3 3h-4m-5 0V7a3 3 0 0 1 3-3h11"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Analytics</h4>
                  <p className="text-white/60 text-sm">View event metrics</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <EventsTable events={eventsData} onDeleteEvent={handleDeleteEvent} />
    </div>
  );
} 