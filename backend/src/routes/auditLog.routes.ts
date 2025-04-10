import express from 'express';
import { getAllAuditLogs } from '../controllers/auditLog.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

// Superadmin only route
router.get(
  '/',
  isAuthenticated,
  authorizeRoles('superadmin'),
  getAllAuditLogs
);

export default router; 