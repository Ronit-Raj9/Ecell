import express from 'express';
import * as galleryOccasionController from '../controllers/gallery-occasion.controller';
import * as galleryPhotoController from '../controllers/gallery-photo.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadGalleryImage } from '../middleware/upload.middleware';
import { wrapAsync } from '../utils/controllerWrapper';

const router = express.Router();

// Public routes
router.get('/occasions', wrapAsync(galleryOccasionController.getAllOccasions));
router.get('/occasions/:id', wrapAsync(galleryOccasionController.getOccasionById));
router.post('/photos/:id/like', wrapAsync(galleryPhotoController.likePhoto));

// Protected routes (authenticated users)
router.post(
  '/photos',
  authenticate,
  uploadGalleryImage.array('photos', 10),
  wrapAsync(galleryPhotoController.uploadPhoto)
);

router.patch(
  '/photos/:id',
  authenticate,
  wrapAsync(galleryPhotoController.updatePhoto)
);

router.delete(
  '/photos/:id',
  authenticate,
  wrapAsync(galleryPhotoController.deletePhoto)
);

// Admin routes
router.get(
  '/admin/occasions',
  authenticate,
  authorize(['admin', 'superadmin']),
  wrapAsync(galleryOccasionController.getAllOccasionsAdmin)
);

router.post(
  '/occasions',
  authenticate,
  authorize(['admin', 'superadmin']),
  wrapAsync(galleryOccasionController.createOccasion)
);

router.patch(
  '/occasions/:id',
  authenticate,
  authorize(['admin', 'superadmin']),
  wrapAsync(galleryOccasionController.updateOccasion)
);

router.delete(
  '/occasions/:id',
  authenticate,
  authorize(['admin', 'superadmin']),
  wrapAsync(galleryOccasionController.deleteOccasion)
);

router.patch(
  '/occasions/:id/cover',
  authenticate,
  authorize(['admin', 'superadmin']),
  wrapAsync(galleryOccasionController.setOccasionCoverImage)
);

router.get(
  '/photos/pending',
  authenticate,
  authorize(['admin', 'superadmin']),
  wrapAsync(galleryPhotoController.getPendingApprovalPhotos)
);

export default router; 