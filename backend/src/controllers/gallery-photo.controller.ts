import { Request, Response } from 'express';
import GalleryPhoto from '../models/gallery-photo.model';
import GalleryOccasion from '../models/gallery-occasion.model';
import { galleryPhotoUploadValidator, galleryPhotoUpdateValidator } from '../validators/gallery.validator';
import { AppError } from '../utils/appError';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { uploadImage, deleteImage } from '../config/cloudinary';

// Upload photo to a gallery occasion
export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    // Ensure file was uploaded
    if (!req.files || req.files.length === 0) {
      throw new AppError('No image files provided', 400);
    }
    
    const { occasion_id, caption } = req.body;
    
    // Validate input
    const validatedData = galleryPhotoUploadValidator.parse(req.body);
    
    // Check if occasion exists
    const occasion = await GalleryOccasion.findById(validatedData.occasion_id);
    
    if (!occasion) {
      throw new AppError('Gallery occasion not found', 404);
    }
    
    // Check if user has permission to add photos
    // Admin and superadmin can always add
    // For normal members, check if the occasion is published
    if (req.user!.role === 'member' && !occasion.is_published) {
      throw new AppError('You do not have permission to add photos to this occasion', 403);
    }
    
    // Determine if photo needs approval (auto-approve for admins)
    const needsApproval = req.user!.role === 'member';
    
    // Process all uploaded files
    const files = req.files as Express.Multer.File[];
    const uploadedPhotos: any[] = [];
    
    for (const file of files) {
      try {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadImage(file.path, `gallery/${occasion_id}`);
        
        // Create the photo
        const photo = await GalleryPhoto.create({
          occasion_id: validatedData.occasion_id,
          image_url: cloudinaryResult.secure_url,
          public_id: cloudinaryResult.public_id, // Store Cloudinary public_id
          caption: validatedData.caption || '',
          uploaded_by: req.user!._id,
          is_approved: !needsApproval,
        });
        
        uploadedPhotos.push(photo.toObject());
        
        // If this is the first photo for the occasion and no cover is set, use it as cover
        if (!occasion.cover_image && uploadedPhotos.length === 1) {
          await GalleryOccasion.findByIdAndUpdate(
            validatedData.occasion_id,
            { cover_image: photo.image_url }
          );
        }
        
        // Delete the temporary file
        fs.unlinkSync(file.path);
      } catch (uploadErr) {
        console.error('Error uploading to Cloudinary:', uploadErr);
        // Continue with next file
      }
    }
    
    res.status(201).json({
      success: true,
      data: {
        photos: uploadedPhotos,
        photo: uploadedPhotos[0] // For backward compatibility
      },
      message: needsApproval ? 
        'Photos uploaded successfully and awaiting approval' : 
        'Photos uploaded successfully'
    });
  } catch (error: any) {
    // Delete uploaded temporary files on error
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error('Failed to delete temporary file:', err);
        }
      }
    }
    
    // Zod validation errors
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to upload photo'
    });
  }
};

// Get all photos for an occasion (admin view)
export const getOccasionPhotosAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid occasion ID format', 400);
    }
    
    // Check if occasion exists
    const occasion = await GalleryOccasion.findById(id);
    
    if (!occasion) {
      throw new AppError('Gallery occasion not found', 404);
    }
    
    // Get all photos including unapproved ones
    const photos = await GalleryPhoto.find({ occasion_id: id })
      .sort({ created_at: -1 })
      .populate('uploaded_by', 'name email')
      .lean();
    
    res.status(200).json({
      success: true,
      data: {
        occasion,
        photos
      }
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch occasion photos'
    });
  }
};

// Update photo (caption, approval status)
export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { caption, is_approved } = req.body;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid photo ID format', 400);
    }
    
    // Validate input
    const validatedData = galleryPhotoUpdateValidator.parse(req.body);
    
    // Find the photo
    const photo = await GalleryPhoto.findById(id).exec();
    
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
    
    // Check if user is the uploader (for caption update only) or admin (for both)
    const uploaderId = photo.uploaded_by instanceof mongoose.Types.ObjectId 
      ? photo.uploaded_by.toString() 
      : String(photo.uploaded_by);
      
    if (
      req.user!.role === 'member' &&
      uploaderId !== req.user!._id.toString()
    ) {
      throw new AppError('You do not have permission to update this photo', 403);
    }
    
    // Members can only update caption, not approval status
    if (req.user!.role === 'member' && validatedData.is_approved !== undefined) {
      throw new AppError('You do not have permission to change approval status', 403);
    }
    
    // Update the photo
    const updatedPhoto = await GalleryPhoto.findByIdAndUpdate(
      id,
      {
        ...(validatedData.caption !== undefined && { caption: validatedData.caption }),
        ...(validatedData.is_approved !== undefined && { is_approved: validatedData.is_approved })
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        photo: updatedPhoto
      },
      message: 'Photo updated successfully'
    });
  } catch (error: any) {
    // Zod validation errors
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update photo'
    });
  }
};

// Delete photo
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid photo ID format', 400);
    }
    
    // Find the photo
    const photo = await GalleryPhoto.findById(id).exec();
    
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
    
    // Check if user is the uploader or admin
    const uploaderId = photo.uploaded_by instanceof mongoose.Types.ObjectId 
      ? photo.uploaded_by.toString() 
      : String(photo.uploaded_by);
      
    if (
      req.user!.role === 'member' &&
      uploaderId !== req.user!._id.toString()
    ) {
      throw new AppError('You do not have permission to delete this photo', 403);
    }
    
    // Delete from Cloudinary if public_id exists
    if (photo.public_id) {
      try {
        await deleteImage(photo.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with deletion from database even if Cloudinary deletion fails
      }
    } else if (photo.image_url && photo.image_url.startsWith('/uploads/')) {
      // Legacy file deletion (for previously uploaded files)
      try {
        const filePath = path.join(__dirname, '../..', photo.image_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Failed to delete file from disk:', err);
      }
    }
    
    // Delete the photo from database
    await GalleryPhoto.findByIdAndDelete(id);
    
    // Check if this was the cover image and update occasion if needed
    const occasion = await GalleryOccasion.findById(photo.occasion_id);
    if (occasion && occasion.cover_image === photo.image_url) {
      // Find another photo to use as cover or set to null
      const anotherPhoto = await GalleryPhoto.findOne({ 
        occasion_id: photo.occasion_id,
        _id: { $ne: photo._id },
        is_approved: true
      });
      
      await GalleryOccasion.findByIdAndUpdate(photo.occasion_id, {
        cover_image: anotherPhoto ? anotherPhoto.image_url : null
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete photo'
    });
  }
};

// Like a photo
export const likePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid photo ID format', 400);
    }
    
    // Find and update the photo
    const photo = await GalleryPhoto.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
    
    res.status(200).json({
      success: true,
      data: {
        likes: photo.likes
      },
      message: 'Photo liked successfully'
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to like photo'
    });
  }
};

// Get all photos pending approval (admin only)
export const getPendingApprovalPhotos = async (req: Request, res: Response) => {
  try {
    // Get photos pending approval
    const photos = await GalleryPhoto.find({ is_approved: false })
      .sort({ created_at: -1 })
      .populate('uploaded_by', 'name email')
      .populate('occasion_id', 'title category')
      .lean();
    
    res.status(200).json({
      success: true,
      data: {
        photos
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch pending approval photos'
    });
  }
}; 