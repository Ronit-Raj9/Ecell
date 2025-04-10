import React from 'react';

export default function JoinPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Join <span className="text-primary">E-Cell</span>
        </h1>
        <div className="w-24 h-1 bg-primary mb-10"></div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          Become a part of our vibrant entrepreneurship community. Whether you're a student with innovative ideas,
          a mentor wanting to guide the next generation, or a partner looking to collaborate, we welcome you.
        </p>

        {/* Placeholder for join form - to be expanded */}
        <div className="bg-gray-100 dark:bg-gray-800 p-12 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-primary">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            We're setting up our membership registration. Please check back soon to join our community.
          </p>
        </div>
      </div>
    </div>
  );
} 