'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import { events } from '@/data/events';
import { formatEventDate, formatEventTime, isUpcomingEvent } from '@/utils/eventHelpers';
import CountdownTimer from '@/components/events/CountdownTimer';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    // Find the event by ID
    const foundEvent = events.find(e => e.id === params.id);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      // Redirect to events page if event not found
      router.push('/events');
    }
  }, [params.id, router]);
  
  if (!event) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="p-8 rounded-xl bg-black/20 backdrop-blur-md border border-white/10">
          <div className="text-white text-xl loading-dots">Loading event details</div>
        </div>
      </div>
    );
  }
  
  const isUpcoming = isUpcomingEvent(event);
  
  const handleParticipate = () => {
    window.open(event.participationLink, '_blank');
  };
  
  const handleJoinEvent = () => {
    setIsParticipating(true);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    // In a real app, this would be an API call to update participant count
    console.log('Joined event:', event.id);
  };
  
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this event: ${event.title}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
    }
  };
  
  return (
    <div className="min-h-screen animated-gradient">
      <div className="container mx-auto px-4 py-16">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center text-white hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Events
          </Link>
        </div>
        
        {/* Event Banner */}
        <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src={event.image}
            alt={event.title}
            className="object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-md"
              >
                {event.category}
              </span>
              {event.isNew && (
                <span className="px-3 py-1 bg-primary rounded-md text-sm font-semibold text-white">
                  NEW
                </span>
              )}
              {event.isPopular && (
                <span className="px-3 py-1 bg-accent rounded-md text-sm font-semibold text-white">
                  POPULAR
                </span>
              )}
              {event.isLimitedSeats && (
                <span className="px-3 py-1 bg-warning text-sm font-semibold text-black rounded-md">
                  LIMITED SEATS
                </span>
              )}
              {event.isTeamEvent && (
                <span className="px-3 py-1 bg-primary/80 backdrop-blur-sm text-white text-sm rounded-md">
                  TEAM EVENT
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 text-shadow-lg">{event.title}</h1>
            <p className="text-xl text-white/90 max-w-3xl text-shadow">{event.shortDescription}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-white/90">{event.description}</p>
              </div>
            </div>
            
            {/* Rules */}
            {event.rules && (
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Event Rules</h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-white/90 font-sans">{event.rules}</pre>
                </div>
              </div>
            )}
            
            {/* Winners (for past events) */}
            {!isUpcoming && event.winners && event.winners.length > 0 && (
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="mr-2">🏆</span>
                  Winners
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.winners.map((winner, index) => (
                    <div key={index} className="bg-primary/10 backdrop-blur-md rounded-lg p-4 border border-primary/20">
                      <div className="font-bold text-lg text-white">{winner.name}</div>
                      <div className="text-accent">{winner.achievement}</div>
                      {winner.role && <div className="text-white/70 text-sm mt-1">{winner.role}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Gallery (for past events) */}
            {!isUpcoming && event.galleryLinks && event.galleryLinks.length > 0 && (
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="mr-2">📸</span>
                  Event Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.galleryLinks.map((image, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Event photo ${index + 1}`}
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        fill
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href="/gallery"
                    className="inline-flex items-center text-primary hover:text-primary-light transition-colors"
                  >
                    View more photos
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Event Highlights (for past events) */}
            {!isUpcoming && event.eventHighlights && (
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="mr-2">✨</span>
                  Event Highlights
                </h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-white/90">{event.eventHighlights}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <div className="text-white font-medium">Date</div>
                    <div className="text-white/70">{formatEventDate(event.date)}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="text-white font-medium">Time</div>
                    <div className="text-white/70">{formatEventTime(event.date)}</div>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <div className="text-white font-medium">Location</div>
                      <div className="text-white/70">{event.location}</div>
                    </div>
                  </div>
                )}
                
                {event.showParticipantCount && (
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <div>
                      <div className="text-white font-medium">Participants</div>
                      <div className="text-white/70">
                        {isParticipating 
                          ? `${(event.currentParticipants || 0) + 1}/${event.maxParticipants || '∞'}` 
                          : `${event.currentParticipants || 0}/${event.maxParticipants || '∞'}`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {isUpcoming && (
                <div className="mt-6 bg-primary/10 backdrop-blur-sm rounded-md p-4">
                  <div className="text-white text-center mb-2">Countdown</div>
                  <CountdownTimer date={event.date} />
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            {isUpcoming ? (
              <div className="space-y-4">
                <button
                  onClick={handleParticipate}
                  className="w-full py-3 px-6 bg-gradient-to-r from-primary to-accent text-white rounded-xl 
                            font-medium shadow-lg hover:shadow-xl transform transition-all duration-300
                            hover:-translate-y-1 focus:ring-2 focus:ring-white/30 focus:outline-none"
                >
                  Participate
                </button>
                
                <button
                  onClick={handleJoinEvent}
                  disabled={isParticipating}
                  className={`w-full py-3 px-6 bg-transparent border border-white/20 text-white rounded-xl 
                            font-medium shadow-sm hover:shadow-md transform transition-all duration-300
                            ${isParticipating ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-white/10'}`}
                >
                  {isParticipating ? 'Already Joined' : 'Join Event'}
                </button>
                
                {/* Success message */}
                {showSuccessMessage && (
                  <div className="bg-success/20 border border-success/30 rounded-md p-3 text-white text-center">
                    Successfully joined the event!
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {event.galleryLinks && event.galleryLinks.length > 0 && (
                  <Link href="/gallery" className="block w-full">
                    <button
                      className="w-full py-3 px-6 bg-gradient-to-r from-primary to-accent text-white rounded-xl 
                                font-medium shadow-lg hover:shadow-xl transform transition-all duration-300
                                hover:-translate-y-1 focus:ring-2 focus:ring-white/30 focus:outline-none"
                    >
                      View Gallery
                    </button>
                  </Link>
                )}
              </div>
            )}
            
            {/* Share section */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Share Event</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-full hover:bg-[#25D366]/20 transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-3 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full hover:bg-[#1DA1F2]/20 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-full hover:bg-[#1877F2]/20 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-3 bg-[#0A66C2]/10 text-[#0A66C2] rounded-full hover:bg-[#0A66C2]/20 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Copy Link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 