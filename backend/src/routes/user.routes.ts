import express from 'express';
import { updateProfile, uploadProfilePicture, deactivateAccount, getAllUsers, updateUserRole } from '../controllers/user.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';
import { uploadImage } from '../utils/multerConfig';

const router = express.Router();

// User routes (protected)
router.patch('/update-profile', isAuthenticated, updateProfile);
router.patch('/upload-profile-picture', isAuthenticated, uploadImage.single('profile_pic'), uploadProfilePicture);
router.patch('/deactivate', isAuthenticated, deactivateAccount);

// Admin routes
router.get('/admin/users', isAuthenticated, authorizeRoles('admin', 'superadmin'), getAllUsers);
router.patch('/admin/update-role', isAuthenticated, authorizeRoles('superadmin'), updateUserRole);

export default router; 