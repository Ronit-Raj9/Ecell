require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user.model');

// Helper to extract branch from roll number
const extractBranchFromRollNo = (rollNo) => {
  const match = rollNo.match(/^(20\d{2})(EEE|BMS|BCS|IMG|IMT)-(\d{3})$/);
  return match ? match[2] : null;
};

// Helper to calculate year based on enrollment year
const calculateStudentYear = (enrollmentYear) => {
  const currentDate = new Date();
  const enrollmentDate = new Date(enrollmentYear, 7, 1); // August 1st of enrollment year
  
  const diffTime = currentDate.getTime() - enrollmentDate.getTime();
  const diffYears = diffTime / (1000 * 3600 * 24 * 365.25); // Account for leap years
  
  if (diffYears < 1) return 1;
  if (diffYears < 2) return 2;
  if (diffYears < 3) return 3;
  if (diffYears < 4) return 4;
  if (diffYears < 5) return 5;
  return 5; // 5+ year
};

async function initializeDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Check if users already exist
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('Database already contains users, skipping initialization');
      process.exit(0);
    }

    // Create test users with new roll number format
    const testUsers = [
      {
        name: 'Student User',
        email: 'student@example.com',
        password: await bcrypt.hash('password123', 10),
        roll_no: '2023BMS-025',
        branch: 'BMS',
        year: calculateStudentYear(2023),
        role: 'member'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        roll_no: '2022EEE-042',
        branch: 'EEE',
        year: calculateStudentYear(2022),
        role: 'admin'
      },
      {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: await bcrypt.hash('super123', 10),
        roll_no: '2021BCS-013',
        branch: 'BCS',
        year: calculateStudentYear(2021),
        role: 'superadmin'
      }
    ];

    // Insert users into the database
    await User.insertMany(testUsers);
    
    console.log('Database initialized with test users:');
    console.log('- Student: student@example.com / password123');
    console.log('- Admin: admin@example.com / admin123');
    console.log('- SuperAdmin: superadmin@example.com / super123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDB(); 