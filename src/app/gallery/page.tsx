'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Define the gallery image interface
interface GalleryImage {
  id: number;
  category: string;
  title: string;
  emoji: string;
  description: string;
  date: string;
}

export default function GalleryPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'events', name: 'Events' },
    { id: 'workshops', name: 'Workshops' },
    { id: 'competitions', name: 'Competitions' },
    { id: 'activities', name: 'Club Activities' }
  ];
  
  // Gallery images mock data
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      category: 'events',
      title: 'Annual Hackathon 2023',
      emoji: '🚀',
      description: 'Students working together during our 48-hour hackathon to build innovative solutions for real-world problems.',
      date: 'November 2023'
    },
    {
      id: 2,
      category: 'workshops',
      title: 'Web Development Workshop',
      emoji: '💻',
      description: 'Members learning modern web development techniques with React and Next.js.',
      date: 'October 2023'
    },
    {
      id: 3,
      category: 'activities',
      title: 'Club Orientation',
      emoji: '👋',
      description: 'Welcoming new members to our club and introducing them to our activities and vision.',
      date: 'September 2023'
    },
    {
      id: 4,
      category: 'events',
      title: 'Tech Talk Series',
      emoji: '🎤',
      description: 'A guest speaker from Google discussing the latest trends in artificial intelligence.',
      date: 'August 2023'
    },
    {
      id: 5,
      category: 'activities',
      title: 'Team Building Activity',
      emoji: '🤝',
      description: 'Members engaging in fun activities to foster collaboration and team spirit.',
      date: 'July 2023'
    },
    {
      id: 6,
      category: 'events',
      title: 'Tech Exhibition',
      emoji: '🔍',
      description: 'Showcasing student projects to the wider campus community during the annual tech fair.',
      date: 'June 2023'
    },
    {
      id: 7,
      category: 'competitions',
      title: 'Programming Contest',
      emoji: '🏆',
      description: 'Members competing to solve algorithmic challenges within a time limit.',
      date: 'May 2023'
    },
    {
      id: 8,
      category: 'activities',
      title: 'Industrial Visit',
      emoji: '🏢',
      description: 'Club members visiting a leading tech company to learn about industry practices.',
      date: 'April 2023'
    },
    {
      id: 9,
      category: 'workshops',
      title: 'UI/UX Design Workshop',
      emoji: '🎨',
      description: 'Learning the principles of user interface and experience design with practical exercises.',
      date: 'March 2023'
    },
    {
      id: 10,
      category: 'competitions',
      title: 'Ideathon',
      emoji: '💡',
      description: 'Teams brainstorming innovative solutions for environmental challenges.',
      date: 'February 2023'
    },
    {
      id: 11,
      category: 'events',
      title: 'Alumni Meetup',
      emoji: '🎓',
      description: 'Connecting current members with alumni working in the tech industry.',
      date: 'January 2023'
    },
    {
      id: 12,
      category: 'activities',
      title: 'End of Year Celebration',
      emoji: '🎉',
      description: 'Celebrating the achievements of our members throughout the academic year.',
      date: 'December 2022'
    },
    {
      id: 13,
      category: 'workshops',
      title: 'Mobile App Development',
      emoji: '📱',
      description: 'Hands-on workshop on building native mobile applications using React Native.',
      date: 'November 2022'
    },
    {
      id: 14,
      category: 'competitions',
      title: 'Capture The Flag',
      emoji: '🚩',
      description: 'Cybersecurity competition where members solved security challenges and puzzles.',
      date: 'October 2022'
    },
    {
      id: 15,
      category: 'events',
      title: 'Fresher\'s Welcome',
      emoji: '🎊',
      description: 'Welcoming the new batch of students to the club with interactive sessions.',
      date: 'September 2022'
    },
    {
      id: 16,
      category: 'workshops',
      title: 'Data Science Basics',
      emoji: '📊',
      description: 'Introduction to data analysis and visualization using Python and popular libraries.',
      date: 'August 2022'
    }
  ];
  
  // Filter images based on selected category
  const filteredImages = selectedTab === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedTab);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Photo <span className="text-primary">Gallery</span>
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore memorable moments from our club events, workshops, and activities
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="inline-flex rounded-md shadow-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedTab(category.id)}
                className={`px-4 py-2 text-sm font-medium ${
                  categories.indexOf(category) === 0 ? 'rounded-l-lg' : ''
                } ${
                  categories.indexOf(category) === categories.length - 1 ? 'rounded-r-lg' : ''
                } ${
                  selectedTab === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-700`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedImage(image)}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center p-4">
                <span className="text-5xl mb-2" role="img" aria-label={image.title}>
                  {image.emoji}
                </span>
                <h3 className="text-sm font-semibold text-center text-gray-900 dark:text-white mt-2">
                  {image.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {image.date}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state when no images match the filter */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No images found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try selecting a different category.
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedImage.title}
              </h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-8xl" role="img" aria-label={selectedImage.title}>
                  {selectedImage.emoji}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedImage.date}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {categories.find(cat => cat.id === selectedImage.category)?.name.slice(0, -1)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {selectedImage.description}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Share this moment</h4>
                <div className="flex space-x-4">
                  <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.129 20 14.99 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 0C4.478 0 0 4.478 0 10c0 4.419 2.865 8.166 6.839 9.489.5.09.682-.218.682-.484 0-.236-.009-.866-.013-1.699-2.782.602-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.465-1.11-1.465-.909-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.891 1.529 2.341 1.089 2.91.833.091-.647.349-1.086.635-1.337-2.22-.251-4.555-1.111-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.097-2.646 0 0 .84-.269 2.75 1.025A9.547 9.547 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.307.679.917.679 1.852 0 1.335-.012 2.415-.012 2.741 0 .269.18.579.688.481C17.14 18.163 20 14.418 20 10 20 4.478 15.522 0 10 0z" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 