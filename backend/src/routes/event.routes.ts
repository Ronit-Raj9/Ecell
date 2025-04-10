import express from 'express';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  cloneEvent,
  manageWinners,
  manageHighlights,
  manageGallery,
  trackFormClick,
  joinEvent,
  getEventAnalytics
} from '../controllers/event.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';
import { uploadImage } from '../utils/multerConfig';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/:id/form-click', trackFormClick); // Track when a user clicks the registration link

// Authenticated user routes
router.post(
  '/:id/join',
  isAuthenticated,
  joinEvent
);

// Admin routes
router.post(
  '/admin',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadImage.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  createEvent
);

router.patch(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadImage.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  updateEvent
);

router.delete(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  deleteEvent
);

// Clone event
router.post(
  '/admin/:id/clone',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  cloneEvent
);

// Winner management
router.patch(
  '/admin/:id/winners',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadImage.fields([
    { name: 'winner_photos', maxCount: 10 } // Allow multiple winner photos
  ]),
  manageWinners
);

// Highlight management
router.patch(
  '/admin/:id/highlights',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadImage.fields([
    { name: 'highlight_images', maxCount: 10 } // Allow multiple highlight images
  ]),
  manageHighlights
);

// Gallery management
router.patch(
  '/admin/:id/gallery',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadImage.fields([
    { name: 'gallery_images', maxCount: 20 } // Allow multiple gallery images
  ]),
  manageGallery
);

// Event analytics
router.get(
  '/admin/:id/analytics',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  getEventAnalytics
);

export default router; 