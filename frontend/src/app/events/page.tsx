'use client';

import { useState, useEffect } from 'react';
import { eventApi } from '@/services/api';
import EventCard from '@/components/events/EventCard';
import { Event } from '@/types/event';

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch upcoming events
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch upcoming events
        const upcomingResponse = await eventApi.getAllEvents({
          event_type: 'upcoming',
          is_published: true
        });
        setUpcomingEvents(upcomingResponse.data.events);
        
        // Fetch past events
        const pastResponse = await eventApi.getAllEvents({
          event_type: 'past',
          is_published: true
        });
        setPastEvents(pastResponse.data.events);
        
        // Extract unique categories from all events
        const allEvents = [...upcomingResponse.data.events, ...pastResponse.data.events];
        const uniqueCategories = Array.from(
          new Set(allEvents.map((event: Event) => event.category))
        );
        setCategories(uniqueCategories as string[]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Filter events based on category and search query
  const filteredUpcomingEvents = upcomingEvents
    .filter(event => {
      // Filter by category if one is selected
      if (selectedCategory && event.category !== selectedCategory) {
        return false;
      }
      
      // Filter by search query if one exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.short_description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  
  const filteredPastEvents = pastEvents
    .filter(event => {
      // Filter by category if one is selected
      if (selectedCategory && event.category !== selectedCategory) {
        return false;
      }
      
      // Filter by search query if one exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.short_description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

  return (
    <div className="min-h-screen animated-gradient pb-20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-shadow-lg">Events</h1>
          <p className="text-white/80 text-xl mb-8">
            Participate in our upcoming events to learn new skills, connect with like-minded
            individuals, and explore opportunities in entrepreneurship and innovation.
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                />
              </div>
              <div className="flex-shrink-0">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full md:w-auto p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Events Counter */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="stat-card py-4 px-8">
              <h3 className="stat-number mb-2">{filteredUpcomingEvents.length}</h3>
              <p className="text-white/80 font-light">Upcoming Events</p>
            </div>
            <div className="stat-card py-4 px-8">
              <h3 className="stat-number mb-2">{filteredPastEvents.length}</h3>
              <p className="text-white/80 font-light">Past Events</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-white p-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <section className="mb-20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
                {/* Calendar add button can go here */}
              </div>
              
              {filteredUpcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredUpcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-10 text-center border border-white/10">
                  <h3 className="text-2xl text-white mb-2">No upcoming events found</h3>
                  <p className="text-white/70">
                    {selectedCategory || searchQuery 
                      ? 'Try changing your filters or search query'
                      : 'Check back soon for new events'}
                  </p>
                </div>
              )}
            </section>

            {/* Past Events */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Past Events</h2>
                {/* Filter options can go here */}
              </div>
              
              {filteredPastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPastEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-10 text-center border border-white/10">
                  <h3 className="text-2xl text-white mb-2">No past events found</h3>
                  <p className="text-white/70">
                    {selectedCategory || searchQuery 
                      ? 'Try changing your filters or search query'
                      : 'Our first events are coming soon!'}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
} 