import React from 'react';

export default function MentorshipPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Startup <span className="text-primary">Mentorship</span>
        </h1>
        <div className="w-24 h-1 bg-primary mb-10"></div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          Connect with experienced entrepreneurs, investors, and industry leaders who can guide you 
          through your startup journey. Our mentors provide valuable insights, feedback, and connections.
        </p>

        {/* Placeholder for mentorship program details - to be expanded */}
        <div className="bg-gray-100 dark:bg-gray-800 p-12 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-primary">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            We're organizing our mentorship platform. Soon you'll be able to connect with industry experts and successful entrepreneurs.
          </p>
        </div>
      </div>
    </div>
  );
} 