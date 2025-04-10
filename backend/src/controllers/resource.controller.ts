import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import Resource from '../models/resource.model';
import cloudinary from '../config/cloudinary';
import AuditLog from '../models/auditLog.model';
import fs from 'fs';

// Get all resources (filtered by visibility)
export const getAllResources = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { category } = req.query;
  
  // Build base query
  const query: any = {};
  
  // Filter by category if provided
  if (category) {
    query.category = category;
  }
  
  // Check if user is authenticated
  if (!req.user) {
    // Public access - only show public resources
    query.visibility = 'public';
  }
  
  // Execute query
  const resources = await Resource.find(query)
    .sort({ uploaded_at: -1 })
    .populate('uploaded_by', 'name');
  
  res.status(200).json({
    success: true,
    count: resources.length,
    data: {
      resources
    }
  });
});

// Admin: Upload resource
export const uploadResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, category, visibility } = req.body;
  const userId = req.user._id;
  
  // Validate required fields
  if (!title || !description || !category) {
    return next(new AppError('Please provide title, description, and category', 400));
  }
  
  // Check if file is uploaded
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }
  
  // Upload file to Cloudinary
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecell/resources',
      resource_type: 'auto' // Auto-detect the file type
    });
    
    // Delete local file after upload
    fs.unlinkSync(req.file.path);
    
    // Create resource
    const resource = await Resource.create({
      title,
      file_url: result.secure_url,
      description,
      uploaded_by: userId,
      category,
      visibility: visibility || 'members-only'
    });
    
    // Record audit log
    await AuditLog.create({
      action: 'upload_resource',
      performed_by: userId,
      target_id: resource._id,
      collection_name: 'Resource'
    });
    
    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: {
        resource
      }
    });
  } catch (error: any) {
    // Delete the local file if upload failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return next(new AppError(`Error uploading file: ${error.message}`, 500));
  }
});

// Get resource by ID
export const getResourceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const resourceId = req.params.id;
  
  const resource = await Resource.findById(resourceId).populate('uploaded_by', 'name');
  
  if (!resource) {
    return next(new AppError('Resource not found', 404));
  }
  
  // Check visibility permissions
  if (resource.visibility === 'members-only' && !req.user) {
    return next(new AppError('This resource is only available to members', 403));
  }
  
  res.status(200).json({
    success: true,
    data: {
      resource
    }
  });
});

// Admin: Update resource
export const updateResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const resourceId = req.params.id;
  const { title, description, category, visibility } = req.body;
  const userId = req.user._id;
  
  // Check if resource exists
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    return next(new AppError('Resource not found', 404));
  }
  
  // Update resource
  const updatedResource = await Resource.findByIdAndUpdate(
    resourceId,
    {
      title: title || resource.title,
      description: description || resource.description,
      category: category || resource.category,
      visibility: visibility || resource.visibility
    },
    { new: true, runValidators: true }
  );
  
  // Record audit log
  await AuditLog.create({
    action: 'update_resource',
    performed_by: userId,
    target_id: resourceId,
    collection_name: 'Resource'
  });
  
  res.status(200).json({
    success: true,
    message: 'Resource updated successfully',
    data: {
      resource: updatedResource
    }
  });
});

// Admin: Delete resource
export const deleteResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const resourceId = req.params.id;
  const userId = req.user._id;
  
  // Check if resource exists
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    return next(new AppError('Resource not found', 404));
  }
  
  // Delete resource
  await Resource.findByIdAndDelete(resourceId);
  
  // Record audit log
  await AuditLog.create({
    action: 'delete_resource',
    performed_by: userId,
    target_id: resourceId,
    collection_name: 'Resource'
  });
  
  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully'
  });
}); 