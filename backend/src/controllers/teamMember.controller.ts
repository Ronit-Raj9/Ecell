import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import TeamMember from '../models/teamMember.model';
import cloudinary from '../config/cloudinary';
import AuditLog from '../models/auditLog.model';
import fs from 'fs';

// Get all team members (public)
export const getAllTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const { team_type, department, batch_year } = req.query;
  
  // Build query
  const query: any = { is_active: true };
  
  // Filter by team type if provided
  if (team_type) {
    query.team_type = team_type;
  }
  
  // Filter by department if provided
  if (department) {
    query.department = department;
  }
  
  // Filter by batch year if provided
  if (batch_year) {
    query.batch_year = batch_year;
  }
  
  // Execute query
  const teamMembers = await TeamMember.find(query)
    .sort({ team_type: -1, order: 1, name: 1 });
  
  // Group by team type
  const core = teamMembers.filter(member => member.team_type === 'core');
  const members = teamMembers.filter(member => member.team_type === 'member');
  
  res.status(200).json({
    success: true,
    count: teamMembers.length,
    data: {
      core,
      members
    }
  });
});

// Admin: Add team member
export const addTeamMember = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { 
    name, email, roll_no, branch, year, position, 
    team_type, department, batch_year, order 
  } = req.body;
  
  const userId = req.user._id;
  
  // Validate required fields
  if (!name || !roll_no || !branch || !year || !position || !team_type || !department || !batch_year) {
    return next(new AppError('Please provide all required fields', 400));
  }
  
  // Upload profile picture if provided
  let profile_pic_url: string | undefined = undefined;
  
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ecell/team_members',
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face'
      });
      
      // Set profile picture URL
      profile_pic_url = result.secure_url;
      
      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    } catch (error: any) {
      // Delete the local file if upload failed
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return next(new AppError(`Error uploading profile picture: ${error.message}`, 500));
    }
  }
  
  // Create team member
  const teamMember = await TeamMember.create({
    name,
    email,
    roll_no,
    branch,
    year,
    profile_pic_url,
    position,
    team_type,
    department,
    batch_year,
    order: order || 0,
    is_active: true,
    added_by: userId
  });
  
  // Record audit log
  await AuditLog.create({
    action: 'add_team_member',
    performed_by: userId,
    target_id: teamMember._id,
    collection_name: 'TeamMember'
  });
  
  res.status(201).json({
    success: true,
    message: 'Team member added successfully',
    data: {
      teamMember
    }
  });
});

// Admin: Update team member
export const updateTeamMember = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const teamMemberId = req.params.id;
  const userId = req.user._id;
  
  // Check if team member exists
  const teamMember = await TeamMember.findById(teamMemberId);
  if (!teamMember) {
    return next(new AppError('Team member not found', 404));
  }
  
  // Update data object
  const updateData: any = { ...req.body };
  
  // Upload new profile picture if provided
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ecell/team_members',
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face'
      });
      
      // Set profile picture URL
      updateData.profile_pic_url = result.secure_url;
      
      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    } catch (error: any) {
      // Delete the local file if upload failed
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return next(new AppError(`Error uploading profile picture: ${error.message}`, 500));
    }
  }
  
  // Update team member
  const updatedTeamMember = await TeamMember.findByIdAndUpdate(
    teamMemberId,
    updateData,
    { new: true, runValidators: true }
  );
  
  // Record audit log
  await AuditLog.create({
    action: 'update_team_member',
    performed_by: userId,
    target_id: teamMemberId,
    collection_name: 'TeamMember'
  });
  
  res.status(200).json({
    success: true,
    message: 'Team member updated successfully',
    data: {
      teamMember: updatedTeamMember
    }
  });
});

// Admin: Delete team member (soft delete)
export const deleteTeamMember = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const teamMemberId = req.params.id;
  const userId = req.user._id;
  
  // Check if team member exists
  const teamMember = await TeamMember.findById(teamMemberId);
  if (!teamMember) {
    return next(new AppError('Team member not found', 404));
  }
  
  // Soft delete by setting is_active to false
  const updatedTeamMember = await TeamMember.findByIdAndUpdate(
    teamMemberId,
    { is_active: false },
    { new: true }
  );
  
  // Record audit log
  await AuditLog.create({
    action: 'delete_team_member',
    performed_by: userId,
    target_id: teamMemberId,
    collection_name: 'TeamMember'
  });
  
  res.status(200).json({
    success: true,
    message: 'Team member removed successfully',
    data: {
      teamMember: updatedTeamMember
    }
  });
}); 