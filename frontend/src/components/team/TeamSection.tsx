'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
};

type TeamSectionProps = {
  title: string;
  subtitle: string;
  members: TeamMember[];
  yearFilter?: 'executive' | 'first';
};

export default function TeamSection({ title, subtitle, members, yearFilter = 'executive' }: TeamSectionProps) {
  // Define roles based on section title
  const isFirstYear = yearFilter === 'first';
  const defaultRole = isFirstYear ? "Member" : "Executive";
  
  // Executive team - 2nd-5th year members
  const executivePlaceholders: TeamMember[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      role: 'Executive',
      image: '/images/placeholders/placeholder1.png',
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        email: 'alex@example.com',
      },
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Executive',
      image: '/images/placeholders/placeholder2.png',
      socialLinks: {
        linkedin: '#',
        github: '#',
        email: 'priya@example.com',
      },
    },
    {
      id: '3',
      name: 'Michael Chen',
      role: 'Executive',
      image: '/images/placeholders/placeholder3.png',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'michael@example.com',
      },
    },
    {
      id: '4',
      name: 'Sophia Rodriguez',
      role: 'Executive',
      image: '/images/placeholders/placeholder4.png',
      socialLinks: {
        twitter: '#',
        linkedin: '#',
        email: 'sophia@example.com',
      },
    },
  ];
  
  // First year members
  const firstYearPlaceholders: TeamMember[] = [
    {
      id: '5',
      name: 'Raj Patel',
      role: 'Member',
      image: '/images/placeholders/placeholder1.png',
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        email: 'raj@example.com',
      },
    },
    {
      id: '6',
      name: 'Emma Wilson',
      role: 'Member',
      image: '/images/placeholders/placeholder2.png',
      socialLinks: {
        linkedin: '#',
        github: '#',
        email: 'emma@example.com',
      },
    },
    {
      id: '7',
      name: 'David Kim',
      role: 'Member',
      image: '/images/placeholders/placeholder3.png',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'david@example.com',
      },
    },
    {
      id: '8',
      name: 'Nina Gupta',
      role: 'Member',
      image: '/images/placeholders/placeholder4.png',
      socialLinks: {
        twitter: '#',
        linkedin: '#',
        email: 'nina@example.com',
      },
    },
  ];

  // Use actual members if provided, otherwise use placeholders
  const displayMembers = members.length > 0 
    ? members.map(member => ({
        ...member,
        role: isFirstYear ? "Member" : "Executive" // Ensure consistent roles for actual members too
      })) 
    : (isFirstYear ? firstYearPlaceholders : executivePlaceholders);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {displayMembers.map((member) => (
          <motion.div
            key={member.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            variants={itemVariants}
          >
            <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-700">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {member.name.split(' ').map(name => name[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-primary dark:text-primary-light font-medium">
                {member.role}
              </p>
              
              <div className="mt-4 flex space-x-3">
                {member.socialLinks?.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.github && (
                  <a 
                    href={member.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.email && (
                  <a 
                    href={`mailto:${member.socialLinks.email}`} 
                    className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
                    aria-label={`Email ${member.name}`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
} 