import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/database';
import { errorMiddleware } from './utils/errorHandler';
import { apiLimiter } from './middlewares/rateLimit';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';
import galleryRoutes from './routes/gallery.routes';
import resourceRoutes from './routes/resource.routes';
import meetingRoutes from './routes/meeting.routes';
import announcementRoutes from './routes/announcement.routes';
import teamMemberRoutes from './routes/teamMember.routes';
import auditLogRoutes from './routes/auditLog.routes';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/team', teamMemberRoutes);
app.use('/api/admin/logs', auditLogRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'E-Cell API is running'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Shut down server on critical errors
  // process.exit(1);
}); 