# E-Cell Website

A comprehensive web application for the Entrepreneurship Cell of your college/university, featuring a public-facing website and an administrative panel.

## Features

- **Public Website**
  - Home page with information about E-Cell
  - Events listing and details
  - Resources section
  - Gallery
  - Team members
  - Contact form

- **Member Features**
  - User authentication (signup/login)
  - User dashboard
  - Event registration
  - Personalized content

- **Admin Panel**
  - User management
  - Event management
  - Resource management
  - Gallery management
  - Team management
  - Announcements
  - Admin-only controls

- **Super Admin Features**
  - All admin features
  - Audit logs
  - Meeting management
  - Role management

## Tech Stack

- **Frontend**
  - Next.js (React framework)
  - TypeScript
  - Tailwind CSS for styling
  - Redux Toolkit for state management
  - Framer Motion for animations

- **Backend**
  - Node.js with Express
  - TypeScript
  - MongoDB with Mongoose
  - JWT for authentication
  - Multer for file uploads
  - Various security middleware

## Setup Instructions

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecell-db
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Build the TypeScript code:
   ```
   npm run build
   ```

5. Initialize the database with test users:
   ```
   npm run init-db
   ```

6. Start the backend server:
   ```
   npm run dev
   ```

   The server will start on port 5000 (or the port specified in your .env file).

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the frontend directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

   The application will be available at http://localhost:3000.

## Test Users

After running the `init-db` script, the following test users will be available:

- **Student User**
  - Email: student@example.com
  - Password: password123
  - Role: member

- **Admin User**
  - Email: admin@example.com
  - Password: admin123
  - Role: admin

- **Super Admin**
  - Email: superadmin@example.com
  - Password: super123
  - Role: superadmin

## Project Structure

### Backend

- `src/index.ts` - Entry point of the application
- `src/routes/` - API routes
- `src/controllers/` - Route controllers
- `src/models/` - Mongoose models
- `src/middleware/` - Custom middleware
- `src/utils/` - Utility functions

### Frontend

- `src/app/` - Next.js app directory with pages
- `src/components/` - React components
- `src/redux/` - Redux store, slices, and actions
- `src/services/` - API service for backend communication
- `public/` - Static files

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/) 