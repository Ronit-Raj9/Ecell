import React from 'react';

export default function StartupsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Our <span className="text-primary">Startups</span>
        </h1>
        <div className="w-24 h-1 bg-primary mb-10"></div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          Meet the innovative startups that have emerged from our entrepreneurship cell.
          These ventures showcase the creativity and entrepreneurial spirit of our community.
        </p>

        {/* Placeholder for startups listing - to be expanded */}
        <div className="bg-gray-100 dark:bg-gray-800 p-12 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-primary">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            We're working on showcasing our amazing startups. Check back soon to learn about these innovative ventures.
          </p>
        </div>
      </div>
    </div>
  );
} 