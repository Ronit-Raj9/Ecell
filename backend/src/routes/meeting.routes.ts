import express from 'express';
import { getAllMeetings, getMeetingById, addMeeting, updateMeeting, deleteMeeting } from '../controllers/meeting.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

// Member routes
router.get('/', isAuthenticated, getAllMeetings);
router.get('/:id', isAuthenticated, getMeetingById);

// Admin routes
router.post(
  '/admin',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  addMeeting
);

router.patch(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  updateMeeting
);

router.delete(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  deleteMeeting
);

export default router; 