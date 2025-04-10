'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types/event';
import { formatEventDate, isUpcomingEvent } from '@/utils/eventHelpers';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface EventsTableProps {
  events: Event[];
  onDelete: (id: string) => void;
}

export default function EventsTable({ events, onDelete }: EventsTableProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter events based on selected criteria
  const filteredEvents = events.filter(event => {
    // Filter by status (upcoming/past)
    if (filterStatus === 'upcoming' && !isUpcomingEvent(event)) {
      return false;
    }
    if (filterStatus === 'past' && isUpcomingEvent(event)) {
      return false;
    }
    
    // Filter by published status
    if (filterPublished === 'published' && !event.isPublished) {
      return false;
    }
    if (filterPublished === 'draft' && event.isPublished) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.shortDescription.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      onDelete(id);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Events</h2>
          <Link 
            href="/admin/events/new" 
            className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl 
                  font-medium shadow-lg hover:shadow-xl transform transition-all duration-300
                  hover:-translate-y-1 focus:ring-2 focus:ring-white/30 focus:outline-none text-center"
          >
            Create Event
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'past')}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white mb-2">Publication Status</label>
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value as 'all' | 'published' | 'draft')}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Events table */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg overflow-x-auto">
        {filteredEvents.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-semibold">Event</th>
                <th className="text-left py-3 px-4 text-white font-semibold hidden md:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-white font-semibold hidden md:table-cell">Categories</th>
                <th className="text-left py-3 px-4 text-white font-semibold hidden md:table-cell">Status</th>
                <th className="text-right py-3 px-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          className="object-cover"
                          fill
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white">{event.title}</div>
                        <div className="text-sm text-white/60 truncate max-w-[200px]">
                          {event.shortDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white/80 hidden md:table-cell">
                    {formatEventDate(event.date)}
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className="px-2 py-1 text-xs rounded-md bg-primary/20 text-primary-light"
                      >
                        {event.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    {event.isPublished ? (
                      <span className="px-2 py-1 text-xs rounded-md bg-success/20 text-success">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-md bg-warning/20 text-warning">
                        Draft
                      </span>
                    )}
                    
                    {isUpcomingEvent(event) ? (
                      <span className="ml-2 px-2 py-1 text-xs rounded-md bg-primary/20 text-primary-light">
                        Upcoming
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-1 text-xs rounded-md bg-white/20 text-white/80">
                        Past
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/events/${event.id}`}
                        className="p-2 text-white/80 hover:text-white transition-colors"
                        aria-label="View event"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      
                      <Link 
                        href={`/admin/events/edit/${event.id}`}
                        className="p-2 text-white/80 hover:text-white transition-colors"
                        aria-label="Edit event"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      
                      {!isUpcomingEvent(event) && event.winners && event.winners.length > 0 ? (
                        <Link 
                          href={`/admin/events/winners/${event.id}`}
                          className="p-2 text-white/80 hover:text-accent transition-colors"
                          aria-label="Manage winners"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </Link>
                      ) : (
                        <Link 
                          href={`/admin/events/winners/${event.id}`}
                          className="p-2 text-white/40 cursor-not-allowed"
                          aria-label="Manage winners"
                          onClick={(e) => e.preventDefault()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => handleDeleteClick(event.id)}
                        className="p-2 text-white/80 hover:text-red-500 transition-colors"
                        aria-label="Delete event"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10">
            <div className="text-white text-xl mb-3">No events found</div>
            <p className="text-white/60">Try changing your filters or search query</p>
          </div>
        )}
      </div>
      
      <div className="text-center text-white/60">
        Total: {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
      </div>
    </div>
  );
} 