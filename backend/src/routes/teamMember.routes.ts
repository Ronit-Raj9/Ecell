import express from 'express';
import { getAllTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamMember.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';
import { uploadImage } from '../utils/multerConfig';

const router = express.Router();

// Public routes
router.get('/', getAllTeamMembers);

// Admin routes
router.post(
  '/admin',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadImage.single('profile_pic'),
  addTeamMember
);

router.patch(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadImage.single('profile_pic'),
  updateTeamMember
);

router.delete(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  deleteTeamMember
);

export default router; 