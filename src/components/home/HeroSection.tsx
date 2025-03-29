'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              <span className="text-primary">Empowering</span> Innovators, <br />
              <span className="text-primary">Nurturing</span> Startups
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Join our vibrant community of entrepreneurs, innovators, and change-makers
              to transform your ideas into successful ventures.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/join"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 smooth-transition"
                >
                  Join Us
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="px-6 py-3 bg-white text-primary border border-primary rounded-lg font-medium shadow-sm hover:shadow-md smooth-transition dark:bg-gray-800 dark:text-white dark:border-gray-700"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-accent rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d="M0,0 L100,0 L100,100 L0,100 Z"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M0,0 L100,100 M100,0 L0,100"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-white text-center">
                    <h3 className="text-3xl font-bold mb-4">Join Our Next Event</h3>
                    <p className="mb-6">Startup Pitch Competition - May 15, 2024</p>
                    <button className="px-6 py-2 bg-white text-primary rounded-lg font-medium shadow-lg hover:shadow-xl smooth-transition">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-2">50+</h3>
            <p className="text-gray-600 dark:text-gray-300">Startups Incubated</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-2">₹2Cr+</h3>
            <p className="text-gray-600 dark:text-gray-300">Funding Raised</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-2">100+</h3>
            <p className="text-gray-600 dark:text-gray-300">Events Hosted</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-2">1000+</h3>
            <p className="text-gray-600 dark:text-gray-300">Community Members</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 