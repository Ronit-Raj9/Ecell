import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import Meeting from '../models/meeting.model';
import AuditLog from '../models/auditLog.model';

// Get all meetings (members only)
export const getAllMeetings = asyncHandler(async (req: Request, res: Response) => {
  const meetings = await Meeting.find()
    .sort({ date: -1 })
    .populate('attended_by', 'name email roll_no');
  
  res.status(200).json({
    success: true,
    count: meetings.length,
    data: {
      meetings
    }
  });
});

// Get meeting by ID
export const getMeetingById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const meetingId = req.params.id;
  
  const meeting = await Meeting.findById(meetingId)
    .populate('attended_by', 'name email roll_no');
  
  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: {
      meeting
    }
  });
});

// Admin: Add new meeting
export const addMeeting = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { date, title, agenda, notes_url, attended_by } = req.body;
  const userId = req.user._id;
  
  // Validate required fields
  if (!date || !title || !agenda || !notes_url) {
    return next(new AppError('Please provide date, title, agenda, and notes URL', 400));
  }
  
  // Create meeting
  const meeting = await Meeting.create({
    date,
    title,
    agenda,
    notes_url,
    attended_by: attended_by || []
  });
  
  // Record audit log
  await AuditLog.create({
    action: 'add_meeting',
    performed_by: userId,
    target_id: meeting._id,
    collection_name: 'Meeting'
  });
  
  res.status(201).json({
    success: true,
    message: 'Meeting added successfully',
    data: {
      meeting
    }
  });
});

// Admin: Update meeting
export const updateMeeting = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const meetingId = req.params.id;
  const userId = req.user._id;
  const { date, title, agenda, notes_url, attended_by } = req.body;
  
  // Check if meeting exists
  const meeting = await Meeting.findById(meetingId);
  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }
  
  // Update meeting
  const updatedMeeting = await Meeting.findByIdAndUpdate(
    meetingId,
    {
      date: date || meeting.date,
      title: title || meeting.title,
      agenda: agenda || meeting.agenda,
      notes_url: notes_url || meeting.notes_url,
      attended_by: attended_by || meeting.attended_by
    },
    { new: true, runValidators: true }
  );
  
  // Record audit log
  await AuditLog.create({
    action: 'update_meeting',
    performed_by: userId,
    target_id: meetingId,
    collection_name: 'Meeting'
  });
  
  res.status(200).json({
    success: true,
    message: 'Meeting updated successfully',
    data: {
      meeting: updatedMeeting
    }
  });
});

// Admin: Delete meeting
export const deleteMeeting = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const meetingId = req.params.id;
  const userId = req.user._id;
  
  // Check if meeting exists
  const meeting = await Meeting.findById(meetingId);
  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }
  
  // Delete meeting
  await Meeting.findByIdAndDelete(meetingId);
  
  // Record audit log
  await AuditLog.create({
    action: 'delete_meeting',
    performed_by: userId,
    target_id: meetingId,
    collection_name: 'Meeting'
  });
  
  res.status(200).json({
    success: true,
    message: 'Meeting deleted successfully'
  });
}); 