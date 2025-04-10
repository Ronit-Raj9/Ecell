'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, getProfile } from '@/redux/slices/authSlice';

// Function to get year text representation
const getYearText = (year: number): string => {
  switch (year) {
    case 1: return '1st Year';
    case 2: return '2nd Year';
    case 3: return '3rd Year';
    case 4: return '4th Year';
    case 5: return '5th Year';
    default: return `${year}th Year`;
  }
};

// Function to get enrollment year from roll number
const getEnrollmentYear = (rollNo: string): number | null => {
  const match = rollNo.match(/^(20\d{2})(EEE|BMS|BCS|IMG|IMT)-(\d{3})$/);
  return match ? parseInt(match[1], 10) : null;
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  
  // Check authentication status on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!user) {
      // If authenticated but no user data, fetch profile
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, router, dispatch]);
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };
  
  // Mock data for upcoming events (to be replaced with API data later)
  const upcomingEvents = [
    {
      id: 1,
      title: 'E-Summit 2024',
      date: 'August 15, 2024',
      time: '10:00 AM - 5:00 PM',
      location: 'Main Auditorium',
    },
    {
      id: 2,
      title: 'Startup Pitch Competition',
      date: 'August 25, 2024',
      time: '2:00 PM - 6:00 PM',
      location: 'Conference Hall A',
    },
    {
      id: 3,
      title: 'Workshop on AI Business Applications',
      date: 'September 10, 2024',
      time: '11:00 AM - 2:00 PM',
      location: 'Smart Classroom 103',
    },
  ];
  
  // Mock data for announcements (to be replaced with API data later)
  const announcements = [
    {
      id: 1,
      title: 'New Mentorship Program',
      date: 'July 28, 2024',
      content: 'E-Cell is launching a new mentorship program connecting students with industry professionals. Applications open next week.'
    },
    {
      id: 2,
      title: 'E-Cell Recruitment Drive',
      date: 'August 5, 2024',
      content: 'We\'re looking for enthusiastic students to join the E-Cell team. Apply before August 20th.'
    },
    {
      id: 3,
      title: 'Entrepreneurship Course Registration',
      date: 'July 25, 2024',
      content: 'Registration for the credit-based Entrepreneurship course is now open for all departments. Limited seats available!'
    },
  ];

  // Show loading state while checking authentication or fetching user
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get enrollment year from roll number
  const enrollmentYear = getEnrollmentYear(user.roll_no);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {user.profile_pic_url ? (
                    <Image
                      src={user.profile_pic_url}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-primary text-white text-2xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.roll_no}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.branch}, {getYearText(user.year)}</p>
                  {enrollmentYear && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled: {enrollmentYear}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary capitalize">{user.role}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Role</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full py-2 px-4 rounded-md flex items-center ${
                    activeTab === 'overview'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full py-2 px-4 rounded-md flex items-center ${
                    activeTab === 'events'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  My Events
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full py-2 px-4 rounded-md flex items-center ${
                    activeTab === 'settings'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>

                {/* Admin panel link for admin users */}
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <Link
                    href="/admin"
                    className="w-full py-2 px-4 rounded-md flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 px-4 rounded-md flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6"
            >
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Welcome back, {user.name.split(' ')[0]}!
                  </h2>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upcoming Events
                      </h3>
                      <Link href="/events" className="text-sm text-primary hover:text-primary-dark">
                        View all events
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {event.title}
                          </h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {event.date} • {event.time}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-start">
                            <svg className="w-4 h-4 mr-1 mt-0.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Announcements
                    </h3>
                    
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="border-l-4 border-primary pl-4 py-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {announcement.title}
                          </h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {announcement.date}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {announcement.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* My Events Tab */}
              {activeTab === 'events' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    My Events
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Registered Events
                    </h3>
                    
                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {event.title}
                              </h4>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {event.date} • {event.time}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-start">
                                <svg className="w-4 h-4 mr-1 mt-0.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                              </div>
                            </div>
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Registered
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Past Events
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 opacity-75">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          Entrepreneurship Workshop
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          July 10, 2024
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Main Seminar Hall
                          </div>
                          <div className="text-sm text-primary">
                            Certificate available
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 opacity-75">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          Startup Funding Masterclass
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          June 20, 2024
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Virtual Event (Zoom)
                          </div>
                          <div className="text-sm text-primary">
                            Certificate available
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Profile Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            defaultValue={user.name}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600"
                            defaultValue={user.email}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Roll Number
                          </label>
                          <input
                            type="text"
                            id="roll_no"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600"
                            defaultValue={user.roll_no}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            defaultValue={user.bio || ''}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Profile Picture
                      </h3>
                      <div className="flex items-center space-x-6">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          {user.profile_pic_url ? (
                            <Image
                              src={user.profile_pic_url}
                              alt={user.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-primary text-white text-3xl font-bold">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="profile_pic" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark cursor-pointer">
                            Change Photo
                            <input type="file" id="profile_pic" className="hidden" accept="image/*" />
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Preferences
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                            defaultChecked
                          />
                          <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Receive email notifications about events
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="announcements"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                            defaultChecked
                          />
                          <label htmlFor="announcements" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Receive announcements and updates
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="public-profile"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                          />
                          <label htmlFor="public-profile" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Make my profile visible to other members
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 