'use client';

import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types/event';
import { generateSlug } from '@/utils/eventHelpers';
import { motion } from 'framer-motion';

interface EventFormProps {
  initialEvent?: Partial<Event>;
  onSubmit: (event: Partial<Event>) => void;
  isSubmitting?: boolean;
}

export default function EventForm({ initialEvent, onSubmit, isSubmitting = false }: EventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [slug, setSlug] = useState(initialEvent?.slug || '');
  const [shortDescription, setShortDescription] = useState(initialEvent?.shortDescription || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [date, setDate] = useState(initialEvent?.date ? new Date(initialEvent.date).toISOString().substring(0, 16) : '');
  const [endDate, setEndDate] = useState(initialEvent?.endDate ? new Date(initialEvent.endDate).toISOString().substring(0, 16) : '');
  const [time, setTime] = useState(initialEvent?.time || '');
  const [venue, setVenue] = useState(initialEvent?.venue || '');
  const [category, setCategory] = useState(initialEvent?.category || '');
  const [banner, setBanner] = useState(initialEvent?.banner || '');
  const [thumbnail, setThumbnail] = useState(initialEvent?.thumbnail || '');
  const [tagsInput, setTagsInput] = useState(initialEvent?.tags ? initialEvent.tags.join(', ') : '');
  const [isPublished, setIsPublished] = useState(initialEvent?.isPublished || false);
  const [isFeatured, setIsFeatured] = useState(initialEvent?.isFeatured || false);
  
  // File upload states
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // References for file inputs
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  // Registration details
  const [registrationStatus, setRegistrationStatus] = useState(initialEvent?.registration?.status || 'coming_soon');
  const [registrationDeadline, setRegistrationDeadline] = useState(
    initialEvent?.registration?.deadline 
      ? new Date(initialEvent.registration.deadline).toISOString().substring(0, 16) 
      : ''
  );
  const [maxParticipants, setMaxParticipants] = useState(initialEvent?.registration?.maxParticipants?.toString() || '');
  const [teamSizeMin, setTeamSizeMin] = useState(initialEvent?.registration?.teamSize?.min?.toString() || '1');
  const [teamSizeMax, setTeamSizeMax] = useState(initialEvent?.registration?.teamSize?.max?.toString() || '1');
  const [feesAmount, setFeesAmount] = useState(initialEvent?.registration?.fees?.amount?.toString() || '');
  const [feesCurrency, setFeesCurrency] = useState(initialEvent?.registration?.fees?.currency || 'INR');
  const [additionalInfo, setAdditionalInfo] = useState(initialEvent?.registration?.additionalInfo || '');
  
  // Auto-generate slug when title changes
  useEffect(() => {
    if (title && !initialEvent?.slug) {
      setSlug(generateSlug(title));
    }
  }, [title, initialEvent?.slug]);

  // Handle file upload for banner
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear the URL field since we're using a file now
      setBanner('');
    }
  };

  // Handle file upload for thumbnail
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear the URL field since we're using a file now
      setThumbnail('');
    }
  };
  
  const categories = [
    'Conference',
    'Hackathon',
    'Workshop',
    'Competition',
    'Seminar',
    'Webinar',
    'Networking',
    'Other'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags from comma-separated string
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    // Construct the event object
    const eventData: Partial<Event> = {
      title,
      slug,
      shortDescription,
      description,
      date: new Date(date).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      time,
      venue,
      category,
      banner,
      thumbnail,
      tags,
      isPublished,
      isFeatured,
      registration: {
        status: registrationStatus as 'open' | 'closed' | 'coming_soon',
        deadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : undefined,
        maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
        teamSize: {
          min: parseInt(teamSizeMin, 10),
          max: parseInt(teamSizeMax, 10)
        },
        fees: feesAmount 
          ? {
              amount: parseInt(feesAmount, 10),
              currency: feesCurrency
            }
          : undefined,
        additionalInfo: additionalInfo || undefined
      }
    };
    
    // If editing, preserve the original ID
    if (initialEvent?.id) {
      eventData.id = initialEvent.id;
    }
    
    // Include the file objects if they exist
    const formData = new FormData();
    if (bannerFile) {
      formData.append('bannerFile', bannerFile);
    }
    if (thumbnailFile) {
      formData.append('thumbnailFile', thumbnailFile);
    }
    
    // For now, we'll just pass the event data
    // In a real implementation, you'd handle file uploads separately or pass formData
    onSubmit(eventData);
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Event Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter event title"
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-white mb-1">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="event-url-slug"
              />
              <p className="text-xs text-white/60 mt-1">
                This will be used in the URL: /events/{slug}
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-white mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              id="shortDescription"
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Brief description (displayed in cards)"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Detailed event description (supports markdown)"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-white mb-1">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-white mb-1">
                End Date & Time
              </label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-white mb-1">
                Display Time <span className="text-red-500">*</span>
              </label>
              <input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. 9:00 AM - 5:00 PM"
              />
              <p className="text-xs text-white/60 mt-1">
                How the time should display to users (can include custom text)
              </p>
            </div>
            
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-white mb-1">
                Venue <span className="text-red-500">*</span>
              </label>
              <input
                id="venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Location or virtual platform"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white mb-1">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Comma-separated tags (e.g. Tech, Startup, Innovation)"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="banner" className="block text-sm font-medium text-white mb-1">
                Banner Image
              </label>
              <div className="space-y-2">
                <div className="flex">
                  <input
                    id="banner"
                    type="text"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="/images/events/event-banner.jpg"
                    disabled={!!bannerPreview}
                  />
                  <button 
                    type="button" 
                    onClick={() => bannerInputRef.current?.click()}
                    className="ml-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                  >
                    Upload
                  </button>
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
                {bannerPreview && (
                  <div className="relative mt-2">
                    <img src={bannerPreview} alt="Banner preview" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => {
                        setBannerPreview(null);
                        setBannerFile(null);
                        if (bannerInputRef.current) bannerInputRef.current.value = '';
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-white mb-1">
                Thumbnail Image
              </label>
              <div className="space-y-2">
                <div className="flex">
                  <input
                    id="thumbnail"
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="/images/events/event-thumb.jpg"
                    disabled={!!thumbnailPreview}
                  />
                  <button 
                    type="button" 
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="ml-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                  >
                    Upload
                  </button>
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                {thumbnailPreview && (
                  <div className="relative mt-2">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setThumbnailFile(null);
                        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 pt-6 border-t border-white/10">
          <h3 className="text-xl font-bold text-white">Registration Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="registrationStatus" className="block text-sm font-medium text-white mb-1">
                Registration Status <span className="text-red-500">*</span>
              </label>
              <select
                id="registrationStatus"
                value={registrationStatus}
                onChange={(e) => setRegistrationStatus(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="coming_soon">Coming Soon</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="registrationDeadline" className="block text-sm font-medium text-white mb-1">
                Registration Deadline
              </label>
              <input
                id="registrationDeadline"
                type="datetime-local"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-white mb-1">
                Max Participants
              </label>
              <input
                id="maxParticipants"
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                min="0"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter number or leave blank"
              />
            </div>
            
            <div>
              <label htmlFor="teamSizeMin" className="block text-sm font-medium text-white mb-1">
                Team Size (Min)
              </label>
              <input
                id="teamSizeMin"
                type="number"
                value={teamSizeMin}
                onChange={(e) => setTeamSizeMin(e.target.value)}
                min="1"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label htmlFor="teamSizeMax" className="block text-sm font-medium text-white mb-1">
                Team Size (Max)
              </label>
              <input
                id="teamSizeMax"
                type="number"
                value={teamSizeMax}
                onChange={(e) => setTeamSizeMax(e.target.value)}
                min="1"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="feesAmount" className="block text-sm font-medium text-white mb-1">
                Registration Fee
              </label>
              <div className="flex">
                <input
                  id="feesAmount"
                  type="number"
                  value={feesAmount}
                  onChange={(e) => setFeesAmount(e.target.value)}
                  min="0"
                  className="w-full px-4 py-2 rounded-l-lg bg-white/5 border-y border-l border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Leave blank if free"
                />
                <select
                  value={feesCurrency}
                  onChange={(e) => setFeesCurrency(e.target.value)}
                  className="px-4 py-2 rounded-r-lg bg-white/10 border-y border-r border-white/10 text-white"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-white mb-1">
                Additional Info
              </label>
              <input
                id="additionalInfo"
                type="text"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Any additional registration information"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6 pt-6 border-t border-white/10">
          <h3 className="text-xl font-bold text-white">Publishing Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                id="isPublished"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded border-white/30 text-primary focus:ring-primary/50 bg-white/5"
              />
              <label htmlFor="isPublished" className="ml-3 text-sm font-medium text-white">
                Publish Event
              </label>
              <span className="ml-2 text-xs text-white/60">
                (Unpublished events are only visible to admins)
              </span>
            </div>
            
            <div className="flex items-center">
              <input
                id="isFeatured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-5 w-5 rounded border-white/30 text-primary focus:ring-primary/50 bg-white/5"
              />
              <label htmlFor="isFeatured" className="ml-3 text-sm font-medium text-white">
                Feature on Homepage
              </label>
              <span className="ml-2 text-xs text-white/60">
                (Featured events appear prominently)
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-xl text-white font-medium text-base
              ${isSubmitting 
                ? 'bg-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20'
              } transition-all duration-300`}
          >
            {isSubmitting ? 'Processing...' : initialEvent?.id ? 'Update Event' : 'Create Event'}
          </motion.button>
        </div>
      </form>
    </div>
  );
} 