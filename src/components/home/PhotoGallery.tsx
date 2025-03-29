'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Mock gallery data - in a real implementation, this would be fetched from an API or database
  const galleryImages = [
    {
      id: 1,
      title: 'Annual Hackathon 2023',
      emoji: '🚀',
      description: 'Students collaborating to build innovative projects during our annual 48-hour hackathon.',
      date: 'November 2023'
    },
    {
      id: 2,
      title: 'Workshop: Web Development',
      emoji: '💻',
      description: 'Learning modern web development techniques with hands-on exercises and expert guidance.',
      date: 'October 2023'
    },
    {
      id: 3,
      title: 'Club Orientation',
      emoji: '👋',
      description: 'Welcoming new members to our club and introducing them to our activities and goals.',
      date: 'September 2023'
    },
    {
      id: 4,
      title: 'Tech Talk Series',
      emoji: '🎤',
      description: 'Industry experts sharing insights about the latest trends and technologies.',
      date: 'August 2023'
    },
    {
      id: 5,
      title: 'Team Building Activity',
      emoji: '🤝',
      description: 'Members engaging in fun activities to foster collaboration and team spirit.',
      date: 'July 2023'
    },
    {
      id: 6,
      title: 'Tech Exhibition',
      emoji: '🔍',
      description: 'Showcasing student projects and innovations to the campus community.',
      date: 'June 2023'
    },
    {
      id: 7,
      title: 'Programming Contest',
      emoji: '🏆',
      description: 'Members competing to solve challenging programming problems within a time limit.',
      date: 'May 2023'
    },
    {
      id: 8,
      title: 'Industrial Visit',
      emoji: '🏢',
      description: 'Exploring leading tech companies to learn about industry practices and work environments.',
      date: 'April 2023'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Club <span className="text-primary">Gallery</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Capturing memorable moments from our club activities, events, and celebrations.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedImage(image.id)}
              className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4">
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
        </div>

        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            View All Photos
          </motion.button>
        </div>
      </div>

      {/* Modal for selected image */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {galleryImages.find(img => img.id === selectedImage)?.title}
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
            <div className="flex-1 overflow-auto p-4">
              <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-8xl" role="img" aria-label="event">
                  {galleryImages.find(img => img.id === selectedImage)?.emoji}
                </span>
              </div>
              <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {galleryImages.find(img => img.id === selectedImage)?.date}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {galleryImages.find(img => img.id === selectedImage)?.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
} 