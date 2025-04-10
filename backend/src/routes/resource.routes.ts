import express from 'express';
import { getAllResources, getResourceById, uploadResource, updateResource, deleteResource } from '../controllers/resource.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';
import { uploadDocument } from '../utils/multerConfig';

const router = express.Router();

// Public/Member routes
router.get('/', getAllResources);
router.get('/:id', getResourceById);

// Admin routes
router.post(
  '/admin',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  uploadDocument.single('file'),
  uploadResource
);

router.patch(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  updateResource
);

router.delete(
  '/admin/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  deleteResource
);

export default router; 