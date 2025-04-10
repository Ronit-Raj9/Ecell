import fs from 'fs';
import path from 'path';
import app from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, './uploads/gallery'),
    path.join(__dirname, './uploads/profiles'),
    path.join(__dirname, './uploads/resources')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Ensure upload directories exist
  ensureUploadDirs();
  
  // Connect to database
  // ... existing database connection code ...
}); 