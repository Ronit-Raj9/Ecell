import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import User from '../models/user.model';
import cloudinary from '../config/cloudinary';
import { updateProfileValidator, updateRoleValidator } from '../validators/user.validator';
import AuditLog from '../models/auditLog.model';

// Update user profile
export const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate input
  try {
    updateProfileValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const userId = req.user._id;
  const { name, bio, year, branch } = req.body;

  // Find and update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, bio, year, branch },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  // Record audit log
  await AuditLog.create({
    action: 'update_profile',
    performed_by: userId,
    target_id: userId,
    collection_name: 'User'
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

// Upload profile picture
export const uploadProfilePicture = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  // Upload image to Cloudinary
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecell/profile_pictures',
      width: 300,
      crop: 'limit'
    });

    // Update user profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile_pic_url: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    // Record audit log
    await AuditLog.create({
      action: 'upload_profile_picture',
      performed_by: userId,
      target_id: userId,
      collection_name: 'User'
    });

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profile_pic_url: result.secure_url
      }
    });
  } catch (error: any) {
    return next(new AppError(`Error uploading image: ${error.message}`, 500));
  }
});

// Deactivate user account
export const deactivateAccount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    { is_active: false },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Record audit log
  await AuditLog.create({
    action: 'deactivate_account',
    performed_by: userId,
    target_id: userId,
    collection_name: 'User'
  });

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

// Admin: Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select('-password_hash');

  res.status(200).json({
    success: true,
    count: users.length,
    data: {
      users
    }
  });
});

// Admin: Update user role
export const updateUserRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate input
  try {
    updateRoleValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const adminId = req.user._id;
  const { userId, role } = req.body;

  // Prevent superadmin from being demoted by anyone other than another superadmin
  if (role !== 'superadmin') {
    const targetUser = await User.findById(userId);
    if (targetUser?.role === 'superadmin' && req.user.role !== 'superadmin') {
      return next(new AppError('You cannot change the role of a superadmin', 403));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  // Record audit log
  await AuditLog.create({
    action: 'update_user_role',
    performed_by: adminId,
    target_id: userId,
    collection_name: 'User'
  });

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: {
      user: updatedUser
    }
  });
}); 