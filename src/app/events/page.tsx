'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Annual Hackathon 2023',
      date: 'November 18-19, 2023',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Campus, Building B, Room 201',
      image: '/images/placeholder.jpg',
      description: 'Join us for our 48-hour hackathon where students from all majors will collaborate to build innovative solutions for real-world problems. Prizes worth ₹50,000 to be won!',
      tags: ['Hackathon', 'Coding', 'Innovation']
    },
    {
      id: 2,
      title: 'Web Development Workshop',
      date: 'October 25, 2023',
      time: '2:00 PM - 4:00 PM',
      location: 'Computer Science Department, Lab 3',
      image: '/images/placeholder.jpg',
      description: 'Learn the fundamentals of modern web development with React and Next.js. This hands-on workshop will cover component-based architecture, state management, and deploying your first web application.',
      tags: ['Workshop', 'Web Development', 'React']
    },
    {
      id: 3,
      title: 'Tech Talk: AI in Healthcare',
      date: 'November 5, 2023',
      time: '5:30 PM - 7:00 PM',
      location: 'Online (Zoom)',
      image: '/images/placeholder.jpg',
      description: 'An insightful talk on how artificial intelligence is transforming healthcare delivery and research. We\'ll have guest speakers from leading healthcare tech companies sharing their experiences.',
      tags: ['Tech Talk', 'AI', 'Healthcare']
    }
  ];
  
  // Mock data for past events
  const pastEvents = [
    {
      id: 4,
      title: 'Code Sprint 2023',
      date: 'September 10, 2023',
      location: 'Computer Science Building',
      image: '/images/placeholder.jpg',
      description: 'A 12-hour coding competition where participants solved algorithmic challenges and complex problems.',
      winners: [
        { name: 'Team Innovators', prize: '1st Prize - ₹20,000', project: 'Smart Traffic Management System' },
        { name: 'Byte Brigade', prize: '2nd Prize - ₹15,000', project: 'AR Navigation App' },
        { name: 'Code Crafters', prize: '3rd Prize - ₹10,000', project: 'Educational Game Platform' }
      ],
      tags: ['Competition', 'Algorithms', 'Problem Solving']
    },
    {
      id: 5,
      title: 'UI/UX Design Workshop',
      date: 'August 20, 2023',
      location: 'Design Studio, Arts Building',
      image: '/images/placeholder.jpg',
      description: 'An interactive workshop on user interface and experience design principles, covering wireframing, prototyping, and user testing.',
      highlights: [
        'Over 100 participants from various departments',
        'Guest speaker from Adobe design team',
        'Hands-on session using Figma and Adobe XD'
      ],
      tags: ['Workshop', 'Design', 'UI/UX']
    },
    {
      id: 6,
      title: 'Machine Learning Bootcamp',
      date: 'July 15-16, 2023',
      location: 'Science Complex, Room 302',
      image: '/images/placeholder.jpg',
      description: 'A two-day intensive bootcamp on machine learning fundamentals, covering supervised and unsupervised learning, neural networks, and practical applications.',
      winners: [
        { name: 'Team Predictors', prize: 'Best Project - ₹15,000', project: 'Crop Yield Prediction System' },
        { name: 'Neural Ninjas', prize: 'Innovation Award - ₹10,000', project: 'Emotion Recognition Tool' }
      ],
      tags: ['Bootcamp', 'Machine Learning', 'AI']
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-primary">Events</span>
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover our exciting lineup of events, workshops, and competitions designed to enhance your skills and connect with fellow members.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'past'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        {activeTab === 'upcoming' && (
          <div className="space-y-12">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-1/3 relative h-64 md:h-auto">
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 md:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {event.title}
                      </h2>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary">
                          Upcoming
                        </span>
                      </div>
                    </div>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {event.time}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {event.location}
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 mb-6">
                      {event.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 mb-6">
                      {event.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div>
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Register Now
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Past Events */}
        {activeTab === 'past' && (
          <div className="space-y-12">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-1/3 relative h-64 md:h-auto">
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 md:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {event.title}
                      </h2>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          Past
                        </span>
                      </div>
                    </div>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {event.location}
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 mb-6">
                      {event.description}
                    </p>
                    
                    {/* Winners section if available */}
                    {event.winners && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.414 5a1 1 0 01-1.414 1.414L13 5.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707L10.586 3A1 1 0 0112 2zm0 10a1 1 0 01.707.293l.707.707L15.414 15a1 1 0 01-1.414 1.414L13 15.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707-.707-.707A1 1 0 0112 12z" clipRule="evenodd" />
                          </svg>
                          Winners
                        </h3>
                        <div className="space-y-3">
                          {event.winners.map((winner, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {winner.name}
                              </div>
                              <div className="text-sm text-primary font-medium">
                                {winner.prize}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                Project: {winner.project}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Highlights section if available */}
                    {event.highlights && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Highlights
                        </h3>
                        <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                          {event.highlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      {event.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center text-primary hover:text-primary-dark"
                      >
                        <span>View details</span>
                        <svg
                          className="ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 