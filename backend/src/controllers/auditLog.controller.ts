import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import AuditLog from '../models/auditLog.model';

// Get all audit logs (superadmin only)
export const getAllAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { action, collection, performed_by, start_date, end_date, limit = 100 } = req.query;
  
  // Build query
  const query: any = {};
  
  // Filter by action if provided
  if (action) {
    query.action = action;
  }
  
  // Filter by collection if provided
  if (collection) {
    query.collection = collection;
  }
  
  // Filter by user who performed the action
  if (performed_by) {
    query.performed_by = performed_by;
  }
  
  // Filter by date range
  if (start_date || end_date) {
    query.timestamp = {};
    
    if (start_date) {
      query.timestamp.$gte = new Date(start_date as string);
    }
    
    if (end_date) {
      query.timestamp.$lte = new Date(end_date as string);
    }
  }
  
  // Execute query with pagination
  const logs = await AuditLog.find(query)
    .sort({ timestamp: -1 })
    .limit(Number(limit))
    .populate('performed_by', 'name email role')
    .populate('target_id');
  
  res.status(200).json({
    success: true,
    count: logs.length,
    data: {
      logs
    }
  });
}); 