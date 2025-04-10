'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { galleryApi } from '@/services/api';

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  icon?: string;
  photo_count: number;
}

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        // Try to get recent gallery items, fallback to getting all occasions with a limit
        const response = await galleryApi.getRecentGalleryItems(8);
        setGalleryItems(response.data.items);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery data');
        setLoading(false);
      }
    };
    
    fetchGalleryData();
  }, []);

  // Fallback emoji mapping for categories if thumbnail is not available
  const getCategoryEmoji = (category: string): string => {
    const emojiMap: {[key: string]: string} = {
      'hackathon': '🚀',
      'workshop': '💻',
      'orientation': '👋',
      'talk': '🎤',
      'team-building': '🤝',
      'exhibition': '🔍',
      'competition': '🏆',
      'visit': '🏢',
      'default': '📷'
    };
    
    // Try to match the category with the map keys
    const key = Object.keys(emojiMap).find(k => category.toLowerCase().includes(k));
    return key ? emojiMap[key] : emojiMap.default;
  };

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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No gallery items available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedImage(item.id)}
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4">
                  {item.thumbnail_url ? (
                    <div className="w-full h-full relative rounded-lg overflow-hidden">
                      <Image 
                        src={item.thumbnail_url} 
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-5xl mb-2" role="img" aria-label={item.title}>
                      {item.icon || getCategoryEmoji(item.category)}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-center text-gray-900 dark:text-white mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View All Photos
            </motion.button>
          </Link>
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
                {galleryItems.find(item => item.id === selectedImage)?.title}
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
              {(() => {
                const selectedItem = galleryItems.find(item => item.id === selectedImage);
                if (!selectedItem) return null;
                
                return (
                  <>
                    <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 relative">
                      {selectedItem.thumbnail_url ? (
                        <Image
                          src={selectedItem.thumbnail_url}
                          alt={selectedItem.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-8xl" role="img" aria-label="event">
                            {selectedItem.icon || getCategoryEmoji(selectedItem.category)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {selectedItem.date}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {selectedItem.description}
                    </p>
                    <div className="mt-4">
                      <Link href={`/gallery/${selectedItem.id}`}>
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                          View All Photos ({selectedItem.photo_count})
                        </button>
                      </Link>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
} 