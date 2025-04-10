import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import Event from '../models/event.model';
import cloudinary from '../config/cloudinary';
import { 
  createEventValidator, 
  updateEventValidator,
  updateWinnersValidator,
  updateHighlightsValidator,
  updateGalleryValidator
} from '../validators/event.validator';
import AuditLog from '../models/auditLog.model';
import fs from 'fs';

// Define the interface for requests with file uploads to match Express.Multer's structure
interface RequestWithFiles extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}

// Get all events with optional filtering
export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
  const { 
    event_type, 
    category, 
    tag, 
    is_featured,
    is_new,
    is_popular,
    is_published,
    search,
    sort = 'date',
    order = 'desc',
    page = 1,
    limit = 10
  } = req.query;

  // Build query
  const query: any = {};
  
  // For public routes, only show published events
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    query.is_published = true;
  } else if (is_published) {
    query.is_published = is_published === 'true';
  }

  // Filter by event type if provided
  if (event_type) {
    query.event_type = event_type;
  }

  // Filter by category if provided
  if (category) {
    query.category = category;
  }

  // Filter by tag if provided
  if (tag) {
    query.tags = { $in: [tag] };
  }

  // Filter by featured status
  if (is_featured) {
    query.is_featured = is_featured === 'true';
  }

  // Filter by new status
  if (is_new) {
    query.is_new = is_new === 'true';
  }

  // Filter by popular status
  if (is_popular) {
    query.is_popular = is_popular === 'true';
  }

  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Create sort object
  const sortObj: any = {};
  sortObj[sort as string] = order === 'desc' ? -1 : 1;

  // Count total documents for pagination
  const totalEvents = await Event.countDocuments(query);

  // Execute query
  const events = await Event.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)
    .populate('created_by', 'name');

  res.status(200).json({
    success: true,
    count: events.length,
    total: totalEvents,
    pages: Math.ceil(totalEvents / limitNum),
    currentPage: pageNum,
    data: {
      events
    }
  });
});

// Get event by ID
export const getEventById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;

  const event = await Event.findById(eventId).populate('created_by', 'name');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Only admins can see unpublished events
  if (!event.is_published && 
      (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin'))) {
    return next(new AppError('Event not found', 404));
  }

  // Increment view count
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    // Create participation_stats if it doesn't exist
    if (!event.participation_stats) {
      event.participation_stats = {
        views: 0,
        form_clicks: 0,
        join_count: 0
      };
    }
    
    // Increment view count
    event.participation_stats.views += 1;
    await event.save();
  }

  res.status(200).json({
    success: true,
    data: {
      event
    }
  });
});

// Create a new event (admin only)
export const createEvent = asyncHandler(async (req: RequestWithFiles, res: Response, next: NextFunction) => {
  // Validate input
  try {
    createEventValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const { 
    title, 
    description, 
    short_description,
    date, 
    end_date,
    time,
    location, 
    venue,
    registration_link, 
    category,
    event_type, 
    is_featured,
    is_new,
    is_popular,
    is_limited_seats,
    is_team_event,
    max_participants,
    show_participant_count,
    outcomes, 
    rules,
    tags,
    is_published
  } = req.body;
  
  const userId = req.user._id;

  // Check if files object exists and has the proper structure
  if (!req.files || typeof req.files !== 'object') {
    return next(new AppError('No files were uploaded', 400));
  }

  // Handle both array and object formats that Multer can provide
  const posterFiles = Array.isArray(req.files) 
    ? req.files.filter(file => file.fieldname === 'poster')
    : req.files.poster;
    
  const thumbnailFiles = Array.isArray(req.files)
    ? req.files.filter(file => file.fieldname === 'thumbnail')
    : req.files.thumbnail;

  // Check if poster image is uploaded
  if (!posterFiles || posterFiles.length === 0) {
    return next(new AppError('Please upload an event poster', 400));
  }

  // Check if thumbnail image is uploaded
  if (!thumbnailFiles || thumbnailFiles.length === 0) {
    return next(new AppError('Please upload an event thumbnail', 400));
  }

  try {
    // Upload poster to Cloudinary
    const posterResult = await cloudinary.uploader.upload(posterFiles[0].path, {
      folder: 'ecell/event_posters',
      width: 1200,
      crop: 'limit'
    });

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(thumbnailFiles[0].path, {
      folder: 'ecell/event_thumbnails',
      width: 400,
      height: 225,
      crop: 'fill'
    });

    // Delete local files after upload
    fs.unlinkSync(posterFiles[0].path);
    fs.unlinkSync(thumbnailFiles[0].path);

    // Create event
    const event = await Event.create({
      title,
      description,
      short_description,
      poster_url: posterResult.secure_url,
      thumbnail_url: thumbnailResult.secure_url,
      date,
      end_date,
      time,
      location,
      venue,
      registration_link,
      category,
      event_type,
      is_featured: is_featured === 'true',
      is_new: is_new === 'true',
      is_popular: is_popular === 'true',
      is_limited_seats: is_limited_seats === 'true',
      is_team_event: is_team_event === 'true',
      max_participants: max_participants ? parseInt(max_participants) : undefined,
      show_participant_count: show_participant_count === 'true',
      outcomes,
      rules,
      tags: tags ? (typeof tags === 'string' ? [tags] : tags) : [],
      is_published: is_published === 'true',
      created_by: userId,
      participation_stats: {
        views: 0,
        form_clicks: 0,
        join_count: 0
      }
    });

    // Record audit log
    await AuditLog.create({
      action: 'create_event',
      performed_by: userId,
      target_id: event._id,
      collection_name: 'Event'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        event
      }
    });
  } catch (error: any) {
    // Delete the local files if upload failed
    if (req.files) {
      // Handle both array and object formats for cleanup
      if (Array.isArray(req.files)) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      } else {
        // Handle object format with files in named fields
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        if (filesObj.poster && filesObj.poster[0] && fs.existsSync(filesObj.poster[0].path)) {
          fs.unlinkSync(filesObj.poster[0].path);
        }
        if (filesObj.thumbnail && filesObj.thumbnail[0] && fs.existsSync(filesObj.thumbnail[0].path)) {
          fs.unlinkSync(filesObj.thumbnail[0].path);
        }
      }
    }
    return next(new AppError(`Error creating event: ${error.message}`, 500));
  }
});

// Update event (admin only)
export const updateEvent = asyncHandler(async (req: RequestWithFiles, res: Response, next: NextFunction) => {
  // Validate input
  try {
    updateEventValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const eventId = req.params.id;
  const userId = req.user._id;
  
  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const updateData: any = { ...req.body };

  // Convert string booleans to actual booleans
  const booleanFields = [
    'is_featured', 'is_new', 'is_popular', 'is_limited_seats', 
    'is_team_event', 'show_participant_count', 'is_published'
  ];
  
  booleanFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updateData[field] = updateData[field] === 'true';
    }
  });

  // Convert number strings to numbers
  if (updateData.max_participants) {
    updateData.max_participants = parseInt(updateData.max_participants);
  }
  
  if (updateData.current_participants) {
    updateData.current_participants = parseInt(updateData.current_participants);
  }

  // Handle tags if provided
  if (req.body.tags) {
    updateData.tags = typeof req.body.tags === 'string' ? [req.body.tags] : req.body.tags;
  }

  // Handle file uploads
  try {
    // Handle both array and object formats that Multer can provide
    if (req.files && typeof req.files === 'object') {
      const filesObj = Array.isArray(req.files)
        ? null // If array format, will handle differently
        : req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle poster upload if provided
      if (Array.isArray(req.files)) {
        const posterFiles = req.files.filter(file => file.fieldname === 'poster');
        if (posterFiles.length > 0) {
          // Upload new poster to Cloudinary
          const posterResult = await cloudinary.uploader.upload(posterFiles[0].path, {
            folder: 'ecell/event_posters',
            width: 1200,
            crop: 'limit'
          });

          // Delete local file after upload
          fs.unlinkSync(posterFiles[0].path);

          // Add poster URL to update data
          updateData.poster_url = posterResult.secure_url;
        }

        const thumbnailFiles = req.files.filter(file => file.fieldname === 'thumbnail');
        if (thumbnailFiles.length > 0) {
          // Upload new thumbnail to Cloudinary
          const thumbnailResult = await cloudinary.uploader.upload(thumbnailFiles[0].path, {
            folder: 'ecell/event_thumbnails',
            width: 400,
            height: 225,
            crop: 'fill'
          });

          // Delete local file after upload
          fs.unlinkSync(thumbnailFiles[0].path);

          // Add thumbnail URL to update data
          updateData.thumbnail_url = thumbnailResult.secure_url;
        }
      } else if (filesObj) {
        // Handle poster upload if provided - object format
        if (filesObj.poster && filesObj.poster.length > 0) {
          // Upload new poster to Cloudinary
          const posterResult = await cloudinary.uploader.upload(filesObj.poster[0].path, {
            folder: 'ecell/event_posters',
            width: 1200,
            crop: 'limit'
          });

          // Delete local file after upload
          fs.unlinkSync(filesObj.poster[0].path);

          // Add poster URL to update data
          updateData.poster_url = posterResult.secure_url;
        }

        // Handle thumbnail upload if provided - object format
        if (filesObj.thumbnail && filesObj.thumbnail.length > 0) {
          // Upload new thumbnail to Cloudinary
          const thumbnailResult = await cloudinary.uploader.upload(filesObj.thumbnail[0].path, {
            folder: 'ecell/event_thumbnails',
            width: 400,
            height: 225,
            crop: 'fill'
          });

          // Delete local file after upload
          fs.unlinkSync(filesObj.thumbnail[0].path);

          // Add thumbnail URL to update data
          updateData.thumbnail_url = thumbnailResult.secure_url;
        }
      }
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    );

    // Record audit log
    await AuditLog.create({
      action: 'update_event',
      performed_by: userId,
      target_id: eventId,
      collection_name: 'Event'
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: {
        event: updatedEvent
      }
    });
  } catch (error: any) {
    // Delete the local files if upload failed
    if (req.files) {
      // Handle both array and object formats for cleanup
      if (Array.isArray(req.files)) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      } else {
        // Handle object format with files in named fields
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        if (filesObj.poster && filesObj.poster[0] && fs.existsSync(filesObj.poster[0].path)) {
          fs.unlinkSync(filesObj.poster[0].path);
        }
        if (filesObj.thumbnail && filesObj.thumbnail[0] && fs.existsSync(filesObj.thumbnail[0].path)) {
          fs.unlinkSync(filesObj.thumbnail[0].path);
        }
      }
    }
    return next(new AppError(`Error updating event: ${error.message}`, 500));
  }
});

// Delete event (admin only)
export const deleteEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Delete event
  await Event.findByIdAndDelete(eventId);

  // Record audit log
  await AuditLog.create({
    action: 'delete_event',
    performed_by: userId,
    target_id: eventId,
    collection_name: 'Event'
  });

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
});

// Clone an event (admin only)
export const cloneEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  // Check if event exists
  const sourceEvent = await Event.findById(eventId);
  if (!sourceEvent) {
    return next(new AppError('Event not found', 404));
  }

  // Clone the event
  const clonedEvent = new Event({
    title: `${sourceEvent.title} (Copy)`,
    description: sourceEvent.description,
    short_description: sourceEvent.short_description,
    poster_url: sourceEvent.poster_url,
    thumbnail_url: sourceEvent.thumbnail_url,
    date: new Date(), // Reset date to current
    time: sourceEvent.time,
    location: sourceEvent.location,
    venue: sourceEvent.venue,
    registration_link: sourceEvent.registration_link,
    category: sourceEvent.category,
    event_type: 'upcoming', // Reset to upcoming
    is_featured: false, // Reset featured status
    is_new: true, // Mark as new
    is_popular: sourceEvent.is_popular,
    is_limited_seats: sourceEvent.is_limited_seats,
    is_team_event: sourceEvent.is_team_event,
    max_participants: sourceEvent.max_participants,
    show_participant_count: sourceEvent.show_participant_count,
    rules: sourceEvent.rules,
    tags: sourceEvent.tags,
    is_published: false, // Set as draft by default
    created_by: userId,
    participation_stats: {
      views: 0,
      form_clicks: 0,
      join_count: 0
    }
  });

  await clonedEvent.save();

  // Record audit log
  await AuditLog.create({
    action: 'clone_event',
    performed_by: userId,
    target_id: clonedEvent._id,
    collection_name: 'Event',
    additional_info: `Cloned from event ID: ${eventId}`
  });

  res.status(201).json({
    success: true,
    message: 'Event cloned successfully',
    data: {
      event: clonedEvent
    }
  });
});

// Manage winners (admin only)
export const manageWinners = asyncHandler(async (req: RequestWithFiles, res: Response, next: NextFunction) => {
  try {
    // Validate input
    updateWinnersValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const eventId = req.params.id;
  const userId = req.user._id;
  const { winners } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Ensure event is a past event
  if (event.event_type !== 'past') {
    return next(new AppError('Winners can only be added to past events', 400));
  }

  // Handle file uploads for winner photos
  const updatedWinners = [...winners];
  
  if (req.files && typeof req.files === 'object') {
    // If files is in array format
    if (Array.isArray(req.files)) {
      const winnerPhotoFiles = req.files.filter(file => file.fieldname.startsWith('winner_photos'));
      
      for (const file of winnerPhotoFiles) {
        const winnerId = file.fieldname.split('-')[1]; // Extract winner ID from field name
        
        try {
          // Upload photo to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'ecell/winner_photos',
            width: 300,
            height: 300,
            crop: 'fill'
          });
          
          // Delete local file after upload
          fs.unlinkSync(file.path);
          
          // Update the winner's photo URL
          const winnerIndex = updatedWinners.findIndex(w => w.id === winnerId);
          if (winnerIndex !== -1) {
            updatedWinners[winnerIndex].photo_url = result.secure_url;
          }
        } catch (error) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          console.error(`Error uploading winner photo: ${error}`);
        }
      }
    } 
    // If files is in object format
    else {
      const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (filesObj.winner_photos) {
        // Process each winner photo
        for (let i = 0; i < filesObj.winner_photos.length; i++) {
          const file = filesObj.winner_photos[i];
          const winnerId = file.fieldname.split('-')[1]; // Extract winner ID from field name
          
          try {
            // Upload photo to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'ecell/winner_photos',
              width: 300,
              height: 300,
              crop: 'fill'
            });
            
            // Delete local file after upload
            fs.unlinkSync(file.path);
            
            // Update the winner's photo URL
            const winnerIndex = updatedWinners.findIndex(w => w.id === winnerId);
            if (winnerIndex !== -1) {
              updatedWinners[winnerIndex].photo_url = result.secure_url;
            }
          } catch (error) {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
            console.error(`Error uploading winner photo: ${error}`);
          }
        }
      }
    }
  }

  // Update event with winners
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { winners: updatedWinners },
    { new: true, runValidators: true }
  );

  // Record audit log
  await AuditLog.create({
    action: 'update_winners',
    performed_by: userId,
    target_id: eventId,
    collection_name: 'Event'
  });

  res.status(200).json({
    success: true,
    message: 'Winners updated successfully',
    data: {
      event: updatedEvent
    }
  });
});

// Manage highlights (admin only)
export const manageHighlights = asyncHandler(async (req: RequestWithFiles, res: Response, next: NextFunction) => {
  try {
    // Validate input
    updateHighlightsValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const eventId = req.params.id;
  const userId = req.user._id;
  const { highlights } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Ensure event is a past event
  if (event.event_type !== 'past') {
    return next(new AppError('Highlights can only be added to past events', 400));
  }

  // Handle file uploads for highlight images
  const updatedHighlights = [...highlights];
  
  if (req.files && typeof req.files === 'object') {
    // If files is in array format
    if (Array.isArray(req.files)) {
      const highlightImageFiles = req.files.filter(file => file.fieldname.startsWith('highlight_images'));
      
      for (const file of highlightImageFiles) {
        const highlightId = file.fieldname.split('-')[1]; // Extract highlight ID from field name
        
        try {
          // Upload image to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'ecell/highlight_images',
            width: 800,
            crop: 'limit'
          });
          
          // Delete local file after upload
          fs.unlinkSync(file.path);
          
          // Update the highlight's image URL
          const highlightIndex = updatedHighlights.findIndex(h => h.id === highlightId);
          if (highlightIndex !== -1) {
            updatedHighlights[highlightIndex].image_url = result.secure_url;
          }
        } catch (error) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          console.error(`Error uploading highlight image: ${error}`);
        }
      }
    } 
    // If files is in object format
    else {
      const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (filesObj.highlight_images) {
        // Process each highlight image
        for (let i = 0; i < filesObj.highlight_images.length; i++) {
          const file = filesObj.highlight_images[i];
          const highlightId = file.fieldname.split('-')[1]; // Extract highlight ID from field name
          
          try {
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'ecell/highlight_images',
              width: 800,
              crop: 'limit'
            });
            
            // Delete local file after upload
            fs.unlinkSync(file.path);
            
            // Update the highlight's image URL
            const highlightIndex = updatedHighlights.findIndex(h => h.id === highlightId);
            if (highlightIndex !== -1) {
              updatedHighlights[highlightIndex].image_url = result.secure_url;
            }
          } catch (error) {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
            console.error(`Error uploading highlight image: ${error}`);
          }
        }
      }
    }
  }

  // Update event with highlights
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { highlights: updatedHighlights },
    { new: true, runValidators: true }
  );

  // Record audit log
  await AuditLog.create({
    action: 'update_highlights',
    performed_by: userId,
    target_id: eventId,
    collection_name: 'Event'
  });

  res.status(200).json({
    success: true,
    message: 'Highlights updated successfully',
    data: {
      event: updatedEvent
    }
  });
});

// Manage gallery (admin only)
export const manageGallery = asyncHandler(async (req: RequestWithFiles, res: Response, next: NextFunction) => {
  try {
    // Validate input
    updateGalleryValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const eventId = req.params.id;
  const userId = req.user._id;
  const { gallery } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Ensure event is a past event
  if (event.event_type !== 'past') {
    return next(new AppError('Gallery images can only be added to past events', 400));
  }

  // Handle file uploads for gallery images
  let updatedGallery = [...gallery]; // Start with existing gallery items
  
  if (req.files && typeof req.files === 'object') {
    // If files is in array format
    if (Array.isArray(req.files)) {
      const galleryImageFiles = req.files.filter(file => file.fieldname.startsWith('gallery_images'));
      
      for (let i = 0; i < galleryImageFiles.length; i++) {
        const file = galleryImageFiles[i];
        const caption = req.body[`caption-${i}`] || '';
        
        try {
          // Upload image to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'ecell/gallery_images',
            width: 1200,
            crop: 'limit'
          });
          
          // Delete local file after upload
          fs.unlinkSync(file.path);
          
          // Add to gallery
          updatedGallery.push({
            url: result.secure_url,
            caption
          });
        } catch (error) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          console.error(`Error uploading gallery image: ${error}`);
        }
      }
    } 
    // If files is in object format
    else {
      const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (filesObj.gallery_images) {
        // Process each gallery image
        for (let i = 0; i < filesObj.gallery_images.length; i++) {
          const file = filesObj.gallery_images[i];
          const caption = req.body[`caption-${i}`] || '';
          
          try {
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'ecell/gallery_images',
              width: 1200,
              crop: 'limit'
            });
            
            // Delete local file after upload
            fs.unlinkSync(file.path);
            
            // Add to gallery
            updatedGallery.push({
              url: result.secure_url,
              caption
            });
          } catch (error) {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
            console.error(`Error uploading gallery image: ${error}`);
          }
        }
      }
    }
  }

  // Update event with gallery
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { gallery: updatedGallery },
    { new: true, runValidators: true }
  );

  // Record audit log
  await AuditLog.create({
    action: 'update_gallery',
    performed_by: userId,
    target_id: eventId,
    collection_name: 'Event'
  });

  res.status(200).json({
    success: true,
    message: 'Gallery updated successfully',
    data: {
      event: updatedEvent
    }
  });
});

// Track form clicks
export const trackFormClick = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Create participation_stats if it doesn't exist
  if (!event.participation_stats) {
    event.participation_stats = {
      views: 0,
      form_clicks: 0,
      join_count: 0
    };
  }

  // Increment form clicks
  event.participation_stats.form_clicks += 1;
  await event.save();

  // Return the form link
  res.status(200).json({
    success: true,
    data: {
      registration_link: event.registration_link
    }
  });
});

// Join event (for logged-in users)
export const joinEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Check if event is upcoming
  if (event.event_type !== 'upcoming') {
    return next(new AppError('You can only join upcoming events', 400));
  }

  // Check if max participants is reached
  if (event.max_participants && (event.current_participants || 0) >= event.max_participants) {
    return next(new AppError('Event has reached maximum participants', 400));
  }

  // Create participation_stats if it doesn't exist
  if (!event.participation_stats) {
    event.participation_stats = {
      views: 0,
      form_clicks: 0,
      join_count: 0
    };
  }

  // Increment participant count and join count
  event.current_participants = (event.current_participants || 0) + 1;
  event.participation_stats.join_count += 1;
  await event.save();

  res.status(200).json({
    success: true,
    message: 'Successfully joined the event',
    data: {
      current_participants: event.current_participants,
      max_participants: event.max_participants
    }
  });
});

// Get event analytics (admin only)
export const getEventAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Prepare analytics data
  const analytics = {
    views: event.participation_stats?.views || 0,
    form_clicks: event.participation_stats?.form_clicks || 0,
    join_count: event.participation_stats?.join_count || 0,
    conversion_rate: 0
  };

  // Calculate conversion rate (form clicks to joins)
  if (analytics.form_clicks > 0) {
    analytics.conversion_rate = (analytics.join_count / analytics.form_clicks) * 100;
  }

  res.status(200).json({
    success: true,
    data: {
      analytics
    }
  });
}); 