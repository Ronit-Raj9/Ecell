import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import GalleryItem from '../models/galleryItem.model';
import Event from '../models/event.model';
import cloudinary from '../config/cloudinary';
import AuditLog from '../models/auditLog.model';
import fs from 'fs';

// Get all gallery items (optionally filtered by event)
export const getAllGalleryItems = asyncHandler(async (req: Request, res: Response) => {
  const { event_id } = req.query;

  // Build query
  const query: any = { is_approved: true };

  // Filter by event if provided
  if (event_id) {
    query.event_id = event_id;
  }

  // Execute query
  const galleryItems = await GalleryItem.find(query)
    .sort({ uploaded_at: -1 })
    .populate('event_id', 'title')
    .populate('uploaded_by', 'name');

  res.status(200).json({
    success: true,
    count: galleryItems.length,
    data: {
      galleryItems
    }
  });
});

// Admin: Get all gallery items including unapproved
export const getAllGalleryItemsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { event_id, is_approved } = req.query;

  // Build query
  const query: any = {};

  // Filter by event if provided
  if (event_id) {
    query.event_id = event_id;
  }

  // Filter by approval status if provided
  if (is_approved !== undefined) {
    query.is_approved = is_approved === 'true';
  }

  // Execute query
  const galleryItems = await GalleryItem.find(query)
    .sort({ uploaded_at: -1 })
    .populate('event_id', 'title')
    .populate('uploaded_by', 'name');

  res.status(200).json({
    success: true,
    count: galleryItems.length,
    data: {
      galleryItems
    }
  });
});

// Upload gallery image
export const uploadGalleryImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { event_id, caption } = req.body;
  const userId = req.user._id;

  // Validate event ID
  if (!event_id) {
    return next(new AppError('Event ID is required', 400));
  }

  // Check if event exists
  const event = await Event.findById(event_id);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Check if image is uploaded
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  // Upload image to Cloudinary
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecell/gallery',
      width: 1200,
      crop: 'limit'
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Create gallery item
    const galleryItem = await GalleryItem.create({
      event_id,
      image_url: result.secure_url,
      caption: caption || '',
      uploaded_by: userId,
      // Set is_approved to true automatically if user is admin or superadmin
      is_approved: ['admin', 'superadmin'].includes(req.user.role)
    });

    // Record audit log
    await AuditLog.create({
      action: 'upload_gallery_image',
      performed_by: userId,
      target_id: galleryItem._id,
      collection_name: 'GalleryItem'
    });

    res.status(201).json({
      success: true,
      message: galleryItem.is_approved 
        ? 'Image uploaded and published successfully' 
        : 'Image uploaded successfully and awaiting approval',
      data: {
        galleryItem
      }
    });
  } catch (error: any) {
    // Delete the local file if upload failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return next(new AppError(`Error uploading image: ${error.message}`, 500));
  }
});

// Admin: Approve gallery image
export const approveGalleryImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const galleryItemId = req.params.id;
  const userId = req.user._id;

  // Check if gallery item exists
  const galleryItem = await GalleryItem.findById(galleryItemId);
  if (!galleryItem) {
    return next(new AppError('Gallery item not found', 404));
  }

  // Update approval status
  galleryItem.is_approved = true;
  await galleryItem.save();

  // Record audit log
  await AuditLog.create({
    action: 'approve_gallery_image',
    performed_by: userId,
    target_id: galleryItemId,
    collection_name: 'GalleryItem'
  });

  res.status(200).json({
    success: true,
    message: 'Gallery image approved successfully',
    data: {
      galleryItem
    }
  });
});

// Delete gallery image
export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const galleryItemId = req.params.id;
  const userId = req.user._id;

  // Check if gallery item exists
  const galleryItem = await GalleryItem.findById(galleryItemId);
  if (!galleryItem) {
    return next(new AppError('Gallery item not found', 404));
  }

  // Only allow the uploader or admins to delete
  if (galleryItem.uploaded_by.toString() !== userId.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
    return next(new AppError('You are not authorized to delete this image', 403));
  }

  // Delete gallery item
  await GalleryItem.findByIdAndDelete(galleryItemId);

  // Record audit log
  await AuditLog.create({
    action: 'delete_gallery_image',
    performed_by: userId,
    target_id: galleryItemId,
    collection_name: 'GalleryItem'
  });

  res.status(200).json({
    success: true,
    message: 'Gallery image deleted successfully'
  });
}); 