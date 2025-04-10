import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import User, { IUser } from '../models/user.model';
import { generateToken } from '../utils/jwtUtils';
import { loginValidator, signupValidator } from '../validators/user.validator';
import AuditLog from '../models/auditLog.model';
import mongoose from 'mongoose';

/**
 * Calculate student year based on enrollment year
 * @param enrollmentYear - The year of enrollment (from roll number)
 * @returns The current academic year (1-5) or 'alumni' if more than 5 years
 */
const calculateStudentYear = (enrollmentYear: number): number => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const enrollmentDate = new Date(enrollmentYear, 7, 1); // August 1st of enrollment year
  
  const diffTime = currentDate.getTime() - enrollmentDate.getTime();
  const diffYears = diffTime / (1000 * 3600 * 24 * 365.25); // Account for leap years
  
  // Calculate the year based on time difference
  if (diffYears < 1) return 1;
  if (diffYears < 2) return 2;
  if (diffYears < 3) return 3;
  if (diffYears < 4) return 4;
  if (diffYears < 5) return 5;
  return 5; // Alumni or 5+ year students are marked as 5th year
};

/**
 * Extract enrollment year and branch from roll number
 * @param rollNo - Roll number in format YYYYBBB-NNN
 * @returns Object with enrollmentYear and branch
 */
const extractRollNumberInfo = (rollNo: string): { enrollmentYear: number; branch: string } => {
  // Parse using regex to extract year and branch
  const match = rollNo.match(/^(20\d{2})(EEE|BMS|BCS|IMG|IMT)-(\d{3})$/);
  
  if (!match) {
    throw new AppError('Invalid roll number format', 400);
  }
  
  return {
    enrollmentYear: parseInt(match[1], 10),
    branch: match[2]
  };
};

// Register a new user
export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate input
  try {
    signupValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const { name, email, password, roll_no } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  // Check if roll number is unique
  const existingRoll = await User.findOne({ roll_no });
  if (existingRoll) {
    return next(new AppError('Roll number is already registered', 400));
  }

  // Extract branch and calculate year from roll number
  try {
    const { enrollmentYear, branch } = extractRollNumberInfo(roll_no);
    const year = calculateStudentYear(enrollmentYear);

    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password_hash: password, // Will be hashed by pre-save hook
      roll_no,
      branch,
      year,
      role: 'member'
    });

    // Generate JWT token
    const token = generateToken((user as any)._id.toString());

    // Record audit log
    await AuditLog.create({
      action: 'user_signup',
      performed_by: user._id,
      collection_name: 'User'
    });

    // Send response without password
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roll_no: user.roll_no,
          branch: user.branch,
          year: user.year,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    return next(error instanceof AppError ? error : new AppError('Registration failed', 500));
  }
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate input
  try {
    loginValidator.parse(req.body);
  } catch (error: any) {
    return next(new AppError(error.errors?.[0]?.message || 'Validation failed', 400));
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password_hash');
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if account is active
  if (!user.is_active) {
    return next(new AppError('Your account has been deactivated', 403));
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Update year based on enrollment year from roll number
  try {
    const { enrollmentYear } = extractRollNumberInfo(user.roll_no);
    const currentYear = calculateStudentYear(enrollmentYear);
    
    // Update user's year if it has changed
    if (user.year !== currentYear) {
      user.year = currentYear;
      await user.save();
    }
  } catch (error) {
    // Continue with login even if year update fails
    console.error('Error updating user year:', error);
  }

  // Generate JWT token
  const token = generateToken((user as any)._id.toString());

  // Record audit log
  await AuditLog.create({
    action: 'user_login',
    performed_by: user._id,
    collection_name: 'User'
  });

  // Send response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roll_no: user.roll_no,
        branch: user.branch,
        year: user.year,
        role: user.role
      },
      token
    }
  });
});

// Get current user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;

  // Update year based on enrollment year from roll number
  try {
    const { enrollmentYear } = extractRollNumberInfo(user.roll_no);
    const currentYear = calculateStudentYear(enrollmentYear);
    
    // Update user's year if it has changed
    if (user.year !== currentYear) {
      user.year = currentYear;
      await User.findByIdAndUpdate(user._id, { year: currentYear });
    }
  } catch (error) {
    // Continue with profile retrieval even if year update fails
    console.error('Error updating user year:', error);
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roll_no: user.roll_no,
        branch: user.branch,
        year: user.year,
        bio: user.bio,
        profile_pic_url: user.profile_pic_url,
        role: user.role
      }
    }
  });
}); 