import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import Announcement from '../models/announcement.model';
import AuditLog from '../models/auditLog.model';

// Get all announcements (filtered by visibility)
export const getAllAnnouncements = asyncHandler(async (req: Request, res: Response) => {
  // Build base query
  const query: any = {};
  
  // Check if user is authenticated
  if (!req.user) {
    // Public access - only show public announcements
    query.visible_to = 'public';
  }
  
  // Execute query
  const announcements = await Announcement.find(query)
    .sort({ created_at: -1 })
    .populate('created_by', 'name');
  
  res.status(200).json({
    success: true,
    count: announcements.length,
    data: {
      announcements
    }
  });
});

// Get announcement by ID
export const getAnnouncementById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const announcementId = req.params.id;
  
  const announcement = await Announcement.findById(announcementId)
    .populate('created_by', 'name');
  
  if (!announcement) {
    return next(new AppError('Announcement not found', 404));
  }
  
  // Check visibility permissions
  if (announcement.visible_to === 'members' && !req.user) {
    return next(new AppError('This announcement is only available to members', 403));
  }
  
  res.status(200).json({
    success: true,
    data: {
      announcement
    }
  });
});

// Admin: Add new announcement
export const addAnnouncement = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, visible_to } = req.body;
  const userId = req.user._id;
  
  // Validate required fields
  if (!title || !content) {
    return next(new AppError('Please provide title and content', 400));
  }
  
  // Create announcement
  const announcement = await Announcement.create({
    title,
    content,
    created_by: userId,
    visible_to: visible_to || 'members'
  });
  
  // Record audit log
  await AuditLog.create({
    action: 'add_announcement',
    performed_by: userId,
    target_id: announcement._id,
    collection_name: 'Announcement'
  });
  
  res.status(201).json({
    success: true,
    message: 'Announcement added successfully',
    data: {
      announcement
    }
  });
});

// Admin: Update announcement
export const updateAnnouncement = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const announcementId = req.params.id;
  const userId = req.user._id;
  const { title, content, visible_to } = req.body;
  
  // Check if announcement exists
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    return next(new AppError('Announcement not found', 404));
  }
  
  // Update announcement
  const updatedAnnouncement = await Announcement.findByIdAndUpdate(
    announcementId,
    {
      title: title || announcement.title,
      content: content || announcement.content,
      visible_to: visible_to || announcement.visible_to
    },
    { new: true, runValidators: true }
  );
  
  // Record audit log
  await AuditLog.create({
    action: 'update_announcement',
    performed_by: userId,
    target_id: announcementId,
    collection_name: 'Announcement'
  });
  
  res.status(200).json({
    success: true,
    message: 'Announcement updated successfully',
    data: {
      announcement: updatedAnnouncement
    }
  });
});

// Admin: Delete announcement
export const deleteAnnouncement = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const announcementId = req.params.id;
  const userId = req.user._id;
  
  // Check if announcement exists
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    return next(new AppError('Announcement not found', 404));
  }
  
  // Delete announcement
  await Announcement.findByIdAndDelete(announcementId);
  
  // Record audit log
  await AuditLog.create({
    action: 'delete_announcement',
    performed_by: userId,
    target_id: announcementId,
    collection_name: 'Announcement'
  });
  
  res.status(200).json({
    success: true,
    message: 'Announcement deleted successfully'
  });
}); 