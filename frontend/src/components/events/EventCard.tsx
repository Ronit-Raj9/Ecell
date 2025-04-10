'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types/event';
import { formatEventDate, formatEventTime, isUpcomingEvent } from '@/utils/eventHelpers';
import CountdownTimer from './CountdownTimer';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const isUpcoming = isUpcomingEvent(event);
  
  return (
    <Link href={`/events/${event.id}`}>
      <div className="event-card overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        {/* Image container with badges overlay */}
        <div className="relative aspect-video overflow-hidden">
          <Image 
            src={event.thumbnail_url || event.poster_url || '/images/placeholder-event.jpg'} 
            alt={event.title} 
            className="event-card-image object-cover w-full h-full"
            width={400}
            height={225}
          />
          
          {/* Badges and overlays */}
          <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {event.is_new && (
                <span className="event-status-badge status-badge-new">
                  NEW
                </span>
              )}
              {event.is_popular && (
                <span className="event-status-badge status-badge-popular">
                  POPULAR
                </span>
              )}
              {event.is_limited_seats && (
                <span className="event-status-badge status-badge-limited">
                  LIMITED SEATS
                </span>
              )}
            </div>
            
            <div className="flex gap-1">
              <span className="category-badge">
                {event.category}
              </span>
            </div>
          </div>
          
          {/* Date overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-6">
            <div className="flex justify-between items-end">
              <div className="date-time-display">
                <p className="text-white font-medium">
                  {formatEventDate(event.date)}
                </p>
                <p className="text-white/90 text-sm">
                  {formatEventTime(event.time)}
                </p>
              </div>
              
              {event.is_team_event && (
                <span className="status-badge-team px-2 py-1 text-xs rounded-md">
                  TEAM EVENT
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <p className="text-white/90 text-sm mb-4 flex-grow">{event.short_description}</p>
          
          <div className="mt-auto">
            {isUpcoming ? (
              <div className="flex flex-col gap-1">
                <div className="bg-primary/10 backdrop-blur-sm rounded-md p-2">
                  <CountdownTimer date={event.date} />
                </div>
                
                {event.show_participant_count && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-white/80">Participants:</span>
                    <span className="text-sm font-semibold text-white">
                      {event.current_participants || 0}/{event.max_participants || '∞'}
                    </span>
                  </div>
                )}
              </div>
            ) : event.winners && event.winners.length > 0 ? (
              <div className="flex items-center text-sm text-white">
                <span className="icon-container-accent mr-2 text-lg">🏆</span>
                <p className="truncate font-medium">
                  {event.winners[0].name} - {event.winners[0].position}
                </p>
              </div>
            ) : (
              <div className="flex items-center text-sm text-white">
                <span className="icon-container mr-2 text-lg">📸</span>
                <p className="font-medium">View gallery</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 