'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      {/* Animated background patterns */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 animate-pulse" 
             style={{ 
               transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
               transition: 'transform 0.2s ease-out'
             }} />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-white/10 animate-pulse" 
             style={{ 
               transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
               transition: 'transform 0.2s ease-out'
             }} />
        <div className="absolute top-[40%] right-[30%] w-60 h-60 rounded-full bg-white/5" 
             style={{ 
               transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
               transition: 'transform 0.2s ease-out'
             }} />
        <div className="dot-pattern absolute inset-0 opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 p-8 rounded-xl backdrop-blur-md bg-black/20 border border-white/10 shadow-xl"
          >
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight text-shadow-lg">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block gradient-text pb-2"
              >
                Empowering
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-white"
              >
                Students,
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="block gradient-text pt-2"
              >
                Building
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-white"
              >
                Community
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-xl text-white/90 max-w-xl font-light text-shadow"
            >
              Join our vibrant community of students, innovators, and tech enthusiasts
              to develop skills and participate in exciting events.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="card-3d p-6 bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden
                          border border-white/20 shadow-xl">
              <div className="relative">
                <div className="float">
                  <div className="flex flex-col items-center bg-black/30 p-8 rounded-xl backdrop-blur-sm border border-white/10">
                    <h3 className="text-3xl font-bold text-white mb-3">Join Our Next Event</h3>
                    <div className="w-full h-1 bg-gradient-to-r from-primary-light to-accent/80 rounded-full mb-6"></div>
                    <div className="bg-white/10 rounded-xl p-6 w-full mb-6">
                      <h4 className="text-xl font-semibold text-white mb-2">Web Development Workshop</h4>
                      <p className="text-white/80 mb-4">Learn modern frameworks and build your portfolio</p>
                      <div className="flex items-center text-white/70 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>May 15, 2024</span>
                      </div>
                    </div>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl 
                                      font-medium shadow-lg hover:shadow-xl transform transition-all duration-300
                                      hover:-translate-y-1 focus:ring-2 focus:ring-white/30 focus:outline-none">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section with modern cards */}
      <div className="container mx-auto px-4 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <div className="stat-card backdrop-blur-md">
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-primary/20 backdrop-blur-xl border border-white/20"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-accent/20 backdrop-blur-xl border border-white/20"></div>
            <h3 className="stat-number mb-2">100+</h3>
            <p className="text-white/80 font-light text-lg">Events Hosted</p>
          </div>
          
          <div className="stat-card backdrop-blur-md">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent/20 backdrop-blur-xl border border-white/20"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-primary/20 backdrop-blur-xl border border-white/20"></div>
            <h3 className="stat-number mb-2">1000+</h3>
            <p className="text-white/80 font-light text-lg">Community Members</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 