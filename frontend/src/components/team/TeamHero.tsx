'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TeamHero() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Meet Our <span className="text-primary">Team</span>
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          The dedicated individuals who drive E-Cell's mission to foster entrepreneurship 
          and innovation across our campus. Together, we're building a vibrant community 
          of future leaders and changemakers.
        </p>
      </motion.div>
    </div>
  );
} 