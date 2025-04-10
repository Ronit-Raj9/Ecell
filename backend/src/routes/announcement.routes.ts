import express from 'express';
import { getAllAnnouncements, getAnnouncementById, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcement.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

// Public/Member routes
router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncementById);

// Admin routes
router.post(
  '/admin',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  addAnnouncement
);

router.patch(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  updateAnnouncement
);

router.delete(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  deleteAnnouncement
);

export default router;
