'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: 'Alex Johnson',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    college: 'University of Technology',
    memberSince: 'September 2023',
    role: 'Member',
    points: 125,
    eventsAttended: 8,
  };
  
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Web Development Workshop',
      date: 'October 25, 2023',
      time: '2:00 PM - 4:00 PM',
      location: 'Computer Science Department, Lab 3',
    },
    {
      id: 2,
      title: 'Tech Talk: AI in Healthcare',
      date: 'November 5, 2023',
      time: '5:30 PM - 7:00 PM',
      location: 'Online (Zoom)',
    },
    {
      id: 3,
      title: 'Annual Hackathon 2023',
      date: 'November 18-19, 2023',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Campus, Building B, Room 201',
    },
  ];
  
  // Mock data for announcements
  const announcements = [
    {
      id: 1,
      title: 'New Club Website Launch',
      date: 'October 10, 2023',
      content: 'We\'re excited to announce the launch of our new club website with member dashboards, event registration, and more features!'
    },
    {
      id: 2,
      title: 'Call for Project Ideas',
      date: 'October 15, 2023',
      content: 'We\'re looking for project ideas for the upcoming semester. Submit your proposals by October 30th.'
    },
    {
      id: 3,
      title: 'Membership Renewal',
      date: 'October 5, 2023',
      content: 'It\'s time to renew your membership for the 2023-2024 academic year. Log in to your dashboard to complete the renewal process.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.college}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member since {user.memberSince}</p>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{user.points}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{user.eventsAttended}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{user.role}</div>
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
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link href="/login" className="w-full py-2 px-4 rounded-md flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Link>
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
                          Code Sprint 2023
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          September 10, 2023
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Computer Science Building
                          </div>
                          <div className="text-sm text-primary">
                            Certificate available
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 opacity-75">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          UI/UX Design Workshop
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          August 20, 2023
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Design Studio, Arts Building
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
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            defaultValue="alex.johnson@example.com"
                          />
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