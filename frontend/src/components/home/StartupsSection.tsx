'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const featuredStartups = [
  {
    id: 1,
    name: 'EcoTech Solutions',
    logo: '🌱',
    description: 'Sustainable technology solutions for a greener future.',
    founder: 'Priya Sharma',
    industry: 'CleanTech',
    year: '2022',
    achievement: 'Raised ₹50 Lakhs in seed funding',
  },
  {
    id: 2,
    name: 'LearnHub',
    logo: '🎓',
    description: 'AI-powered personalized learning platform for students.',
    founder: 'Rahul Verma',
    industry: 'EdTech',
    year: '2021',
    achievement: 'Over 10,000 active users',
  },
  {
    id: 3,
    name: 'MedConnect',
    logo: '⚕️',
    description: 'Connecting patients with healthcare providers in rural areas.',
    founder: 'Aditi Patel',
    industry: 'HealthTech',
    year: '2023',
    achievement: 'Winner of National Health Innovation Award',
  },
  {
    id: 4,
    name: 'FinTrack',
    logo: '💰',
    description: 'Personal finance management and investment platform.',
    founder: 'Vikram Singh',
    industry: 'FinTech',
    year: '2022',
    achievement: 'Featured in Forbes 30 Under 30',
  },
];

export default function StartupsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Featured <span className="text-primary">Startups</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Meet some of the innovative startups that have emerged from our entrepreneurship cell.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredStartups.map((startup, index) => (
            <motion.div
              key={startup.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(startup.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group relative"
            >
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 z-10 opacity-0 transition-opacity duration-300 ${
                  hoveredId === startup.id ? 'opacity-100' : ''
                } flex items-center justify-center`}
              >
                <div className="text-white p-6 text-center">
                  <p className="mb-4">{startup.description}</p>
                  <button className="px-4 py-2 bg-white text-primary rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                    View Success Story
                  </button>
                </div>
              </div>
              <div className="h-40 bg-primary/10 flex items-center justify-center text-5xl">
                {startup.logo}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {startup.name}
                </h3>
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1 text-sm">
                    <span className="font-semibold mr-2">Founder:</span> {startup.founder}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1 text-sm">
                    <span className="font-semibold mr-2">Industry:</span> {startup.industry}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <span className="font-semibold mr-2">Year:</span> {startup.year}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                    {startup.achievement}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/startups"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View All Startups
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 