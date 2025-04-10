'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { events } from '@/data/events';
import { Event, Winner, EventHighlight, GalleryImage } from '@/types/event';
import { isPastEvent } from '@/utils/eventHelpers';

export default function ManageWinnersPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [highlights, setHighlights] = useState<EventHighlight[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  // Form states for adding new items
  const [newWinner, setNewWinner] = useState<Partial<Winner>>({
    name: '',
    position: '',
    prize: '',
    photoUrl: ''
  });
  
  const [newHighlight, setNewHighlight] = useState<Partial<EventHighlight>>({
    title: '',
    description: '',
    imageUrl: ''
  });
  
  const [newGalleryImage, setNewGalleryImage] = useState<Partial<GalleryImage>>({
    url: '',
    caption: ''
  });

  // Fetch event data
  useEffect(() => {
    if (params.id) {
      const eventData = events.find(e => e.id === params.id);
      if (eventData) {
        setEvent(eventData);
        setWinners(eventData.winners || []);
        setHighlights(eventData.highlights || []);
        setGallery(eventData.gallery || []);
      }
      setLoading(false);
    }
  }, [params.id]);

  // Add a new winner
  const addWinner = () => {
    if (newWinner.name && newWinner.position) {
      const winner: Winner = {
        id: `winner-${Date.now()}`,
        name: newWinner.name,
        position: newWinner.position,
        prize: newWinner.prize || '',
        photoUrl: newWinner.photoUrl
      };
      
      setWinners([...winners, winner]);
      setNewWinner({ name: '', position: '', prize: '', photoUrl: '' });
    }
  };

  // Remove a winner
  const removeWinner = (id: string) => {
    setWinners(winners.filter(winner => winner.id !== id));
  };

  // Add a new highlight
  const addHighlight = () => {
    if (newHighlight.title && newHighlight.description) {
      const highlight: EventHighlight = {
        id: `highlight-${Date.now()}`,
        title: newHighlight.title,
        description: newHighlight.description,
        imageUrl: newHighlight.imageUrl
      };
      
      setHighlights([...highlights, highlight]);
      setNewHighlight({ title: '', description: '', imageUrl: '' });
    }
  };

  // Remove a highlight
  const removeHighlight = (id: string) => {
    setHighlights(highlights.filter(highlight => highlight.id !== id));
  };

  // Add a new gallery image
  const addGalleryImage = () => {
    if (newGalleryImage.url) {
      const image: GalleryImage = {
        id: `gallery-${Date.now()}`,
        url: newGalleryImage.url,
        caption: newGalleryImage.caption
      };
      
      setGallery([...gallery, image]);
      setNewGalleryImage({ url: '', caption: '' });
    }
  };

  // Remove a gallery image
  const removeGalleryImage = (id: string) => {
    setGallery(gallery.filter(image => image.id !== id));
  };

  // Save changes
  const saveChanges = async () => {
    if (!event) return;
    
    // In a real application, this would be an API call
    // For now, we'll simulate the update
    const updatedEvent = {
      ...event,
      winners,
      highlights,
      gallery
    };
    
    // Log the updated event data (replace with API call in real app)
    console.log('Saving event data:', updatedEvent);
    
    // Show success message
    alert('Event details updated successfully!');
    
    // Navigate back to events management
    router.push('/admin/events');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6">
        <div className="container mx-auto py-8">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Event Not Found</h2>
            <p className="text-white/70 mb-6">The event you are looking for does not exist or has been removed.</p>
            <Link href="/admin/events">
              <button className="px-4 py-2 bg-primary text-white rounded-lg">
                Back to Events
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if the event is past (winners can only be managed for past events)
  const isPast = isPastEvent(event);
  
  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Event Details</h1>
            <p className="text-white/70 mt-1">{event.title}</p>
          </div>
          
          <div className="flex space-x-3">
            <Link href="/admin/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg border border-white/10 text-white/80 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Events
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveChanges}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Changes
            </motion.button>
          </div>
        </div>

        {!isPast && (
          <div className="bg-amber-500/20 backdrop-blur-md rounded-xl border border-amber-500/30 shadow-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-amber-500 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Upcoming Event</h3>
                <p className="text-white/70">Winners, highlights, and gallery can only be managed after the event has ended.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Winners Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
              Winners
            </h2>
            
            <div className="space-y-6">
              {/* Add Winner Form */}
              <div className={`p-4 border border-white/10 rounded-lg bg-white/5 space-y-4 ${!isPast ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-white font-medium">Add Winner</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Name</label>
                    <input
                      type="text"
                      value={newWinner.name}
                      onChange={(e) => setNewWinner({...newWinner, name: e.target.value})}
                      className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      placeholder="Winner name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Position</label>
                    <input
                      type="text"
                      value={newWinner.position}
                      onChange={(e) => setNewWinner({...newWinner, position: e.target.value})}
                      className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      placeholder="1st Place"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Prize</label>
                    <input
                      type="text"
                      value={newWinner.prize}
                      onChange={(e) => setNewWinner({...newWinner, prize: e.target.value})}
                      className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      placeholder="Rs. 50,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Photo URL (optional)</label>
                    <input
                      type="text"
                      value={newWinner.photoUrl || ''}
                      onChange={(e) => setNewWinner({...newWinner, photoUrl: e.target.value})}
                      className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
                
                <button
                  onClick={addWinner}
                  disabled={!newWinner.name || !newWinner.position}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 disabled:pointer-events-none"
                >
                  Add Winner
                </button>
              </div>
              
              {/* Winners List */}
              {winners.length > 0 ? (
                <div className="space-y-3">
                  {winners.map((winner) => (
                    <div key={winner.id} className="p-4 border border-white/10 rounded-lg bg-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {winner.photoUrl ? (
                          <div className="w-10 h-10 relative rounded-full overflow-hidden">
                            <Image src={winner.photoUrl} alt={winner.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                            {winner.name.charAt(0)}
                          </div>
                        )}
                        
                        <div>
                          <h4 className="text-white font-medium">{winner.name}</h4>
                          <div className="flex gap-2 text-sm">
                            <span className="text-primary">{winner.position}</span>
                            {winner.prize && <span className="text-white/70">• {winner.prize}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeWinner(winner.id)}
                        className={`text-white/50 hover:text-red-500 ${!isPast ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-white/50">
                  No winners added yet
                </div>
              )}
            </div>
          </div>
          
          {/* Highlights Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Event Highlights
            </h2>
            
            <div className="space-y-6">
              {/* Add Highlight Form */}
              <div className={`p-4 border border-white/10 rounded-lg bg-white/5 space-y-4 ${!isPast ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-white font-medium">Add Highlight</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Title</label>
                    <input
                      type="text"
                      value={newHighlight.title}
                      onChange={(e) => setNewHighlight({...newHighlight, title: e.target.value})}
                      className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      placeholder="Highlight title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Description</label>
                    <textarea
                      value={newHighlight.description}
                      onChange={(e) => setNewHighlight({...newHighlight, description: e.target.value})}
                      className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      placeholder="Describe the highlight"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Image URL (optional)</label>
                    <input
                      type="text"
                      value={newHighlight.imageUrl || ''}
                      onChange={(e) => setNewHighlight({...newHighlight, imageUrl: e.target.value})}
                      className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      placeholder="https://example.com/highlight.jpg"
                    />
                  </div>
                </div>
                
                <button
                  onClick={addHighlight}
                  disabled={!newHighlight.title || !newHighlight.description}
                  className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark disabled:opacity-50 disabled:pointer-events-none"
                >
                  Add Highlight
                </button>
              </div>
              
              {/* Highlights List */}
              {highlights.length > 0 ? (
                <div className="space-y-3">
                  {highlights.map((highlight) => (
                    <div key={highlight.id} className="p-4 border border-white/10 rounded-lg bg-white/5">
                      <div className="flex justify-between">
                        <h4 className="text-white font-medium">{highlight.title}</h4>
                        <button
                          onClick={() => removeHighlight(highlight.id)}
                          className={`text-white/50 hover:text-red-500 ${!isPast ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                      
                      <p className="text-white/70 text-sm mt-1">{highlight.description}</p>
                      
                      {highlight.imageUrl && (
                        <div className="mt-3 relative h-32 rounded-lg overflow-hidden">
                          <Image src={highlight.imageUrl} alt={highlight.title} fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-white/50">
                  No highlights added yet
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Gallery Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Event Gallery
          </h2>
          
          <div className="space-y-6">
            {/* Add Gallery Image Form */}
            <div className={`p-4 border border-white/10 rounded-lg bg-white/5 space-y-4 ${!isPast ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-white font-medium">Add Gallery Image</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newGalleryImage.url}
                    onChange={(e) => setNewGalleryImage({...newGalleryImage, url: e.target.value})}
                    className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-1">Caption (optional)</label>
                  <input
                    type="text"
                    value={newGalleryImage.caption || ''}
                    onChange={(e) => setNewGalleryImage({...newGalleryImage, caption: e.target.value})}
                    className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Image caption"
                  />
                </div>
              </div>
              
              <button
                onClick={addGalleryImage}
                disabled={!newGalleryImage.url}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
              >
                Add Image
              </button>
            </div>
            
            {/* Gallery Images Grid */}
            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-white/10">
                      <Image src={image.url} alt={image.caption || 'Gallery image'} fill className="object-cover" />
                    </div>
                    
                    {image.caption && (
                      <div className="text-white/70 text-sm truncate mt-1 px-1">{image.caption}</div>
                    )}
                    
                    <button
                      onClick={() => removeGalleryImage(image.id)}
                      className={`absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white/80 hover:text-red-500 ${!isPast ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                No gallery images added yet
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveChanges}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Changes
          </motion.button>
        </div>
      </div>
    </div>
  );
} 