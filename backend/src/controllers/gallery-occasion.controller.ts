import { Request, Response } from 'express';
import GalleryOccasion from '../models/gallery-occasion.model';
import GalleryPhoto from '../models/gallery-photo.model';
import { galleryOccasionValidator } from '../validators/gallery.validator';
import { AppError } from '../utils/appError';
import mongoose from 'mongoose';
import { deleteImage } from '../config/cloudinary';

// Get all occasions (public) with basic info
export const getAllOccasions = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    // Build query based on filters
    const query: any = { is_published: true };
    
    // Apply category filter if provided
    if (category && ['events', 'workshops', 'competitions', 'activities'].includes(category as string)) {
      query.category = category;
    }
    
    // Find occasions with cover image and creator information
    const occasions = await GalleryOccasion.find(query)
      .sort({ date: -1 })
      .populate('created_by', 'name email')
      .lean();
      
    // For each occasion, get the photo count
    const occasionsWithPhotoCount = await Promise.all(
      occasions.map(async (occasion) => {
        const photoCount = await GalleryPhoto.countDocuments({ 
          occasion_id: occasion._id,
          is_approved: true
        });
        
        return {
          ...occasion,
          photo_count: photoCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        occasions: occasionsWithPhotoCount
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch gallery occasions'
    });
  }
};

// Get single occasion with photos
export const getOccasionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid occasion ID format', 400);
    }
    
    // Find the occasion
    const occasion = await GalleryOccasion.findOne({ 
      _id: id,
      is_published: true 
    })
    .populate('created_by', 'name email')
    .lean();
    
    if (!occasion) {
      throw new AppError('Gallery occasion not found', 404);
    }
    
    // Get photos for this occasion
    const photos = await GalleryPhoto.find({ 
      occasion_id: id,
      is_approved: true
    })
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
      message: error.message || 'Failed to fetch gallery occasion'
    });
  }
};

// Admin routes below

// Create new occasion (admin only)
export const createOccasion = async (req: Request, res: Response) => {
  try {
    const { title, description, date, category, is_published } = req.body;
    
    // Validate input
    const validatedData = galleryOccasionValidator.parse(req.body);
    
    // Create new occasion
    const newOccasion = await GalleryOccasion.create({
      ...validatedData,
      date: new Date(validatedData.date),
      created_by: req.user!._id
    });
    
    res.status(201).json({
      success: true,
      data: {
        occasion: newOccasion
      },
      message: 'Gallery occasion created successfully'
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
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create gallery occasion'
    });
  }
};

// Update occasion (admin only)
export const updateOccasion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, category, is_published } = req.body;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid occasion ID format', 400);
    }
    
    // Validate input
    const validatedData = galleryOccasionValidator.parse(req.body);
    
    // Find and update the occasion
    const updatedOccasion = await GalleryOccasion.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        date: new Date(validatedData.date)
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedOccasion) {
      throw new AppError('Gallery occasion not found', 404);
    }
    
    res.status(200).json({
      success: true,
      data: {
        occasion: updatedOccasion
      },
      message: 'Gallery occasion updated successfully'
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
      message: error.message || 'Failed to update gallery occasion'
    });
  }
};

// Set cover image for occasion (admin only)
export const setOccasionCoverImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { photoId } = req.body;
    
    // Validate ID formats
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(photoId)) {
      throw new AppError('Invalid ID format', 400);
    }
    
    // Find the photo to get the image URL
    const photo = await GalleryPhoto.findOne({ 
      _id: photoId,
      occasion_id: id
    });
    
    if (!photo) {
      throw new AppError('Photo not found or does not belong to this occasion', 404);
    }
    
    // Update the occasion with cover image
    const updatedOccasion = await GalleryOccasion.findByIdAndUpdate(
      id,
      { cover_image: photo.image_url },
      { new: true }
    );
    
    if (!updatedOccasion) {
      throw new AppError('Gallery occasion not found', 404);
    }
    
    res.status(200).json({
      success: true,
      data: {
        occasion: updatedOccasion
      },
      message: 'Cover image updated successfully'
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to set cover image'
    });
  }
};

// Delete occasion (admin only)
export const deleteOccasion = async (req: Request, res: Response) => {
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
    
    // Get all photos to delete from Cloudinary
    const photos = await GalleryPhoto.find({ occasion_id: id });
    
    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Delete from Cloudinary
      for (const photo of photos) {
        if (photo.public_id) {
          try {
            console.log(`Deleting photo from Cloudinary: ${photo.public_id}`);
            await deleteImage(photo.public_id);
          } catch (cloudinaryError) {
            console.error('Error deleting photo from Cloudinary:', cloudinaryError);
            // Continue with deletion even if Cloudinary deletion fails
          }
        }
      }
      
      // Delete all photos for this occasion from the database
      await GalleryPhoto.deleteMany({ occasion_id: id }, { session });
      
      // Delete the occasion
      await GalleryOccasion.findByIdAndDelete(id, { session });
      
      // Commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End session
      session.endSession();
    }
    
    res.status(200).json({
      success: true,
      message: 'Gallery occasion and all associated photos deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting gallery occasion:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete gallery occasion'
    });
  }
};

// Get all occasions (admin view) with more details
export const getAllOccasionsAdmin = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    // Build query based on filters
    const query: any = {};
    
    // Apply category filter if provided
    if (category && ['events', 'workshops', 'competitions', 'activities'].includes(category as string)) {
      query.category = category;
    }
    
    // Find occasions with creator information
    const occasions = await GalleryOccasion.find(query)
      .sort({ created_at: -1 })
      .populate('created_by', 'name email')
      .lean();
      
    // For each occasion, get the photo details
    const occasionsWithPhotoDetails = await Promise.all(
      occasions.map(async (occasion) => {
        const totalPhotos = await GalleryPhoto.countDocuments({ occasion_id: occasion._id });
        const pendingApproval = await GalleryPhoto.countDocuments({ 
          occasion_id: occasion._id,
          is_approved: false
        });
        
        return {
          ...occasion,
          stats: {
            total_photos: totalPhotos,
            pending_approval: pendingApproval
          }
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        occasions: occasionsWithPhotoDetails
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch gallery occasions'
    });
  }
}; 