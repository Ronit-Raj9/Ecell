import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Contact <span className="text-primary">Us</span>
        </h1>
        <div className="w-24 h-1 bg-primary mb-10"></div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          Have questions or want to get in touch with our team? Reach out to us using the contact information
          below or fill out the contact form, and we'll get back to you as soon as possible.
        </p>

        {/* Placeholder for contact form - to be expanded */}
        <div className="bg-gray-100 dark:bg-gray-800 p-12 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-primary">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            We're setting up our contact form. In the meantime, you can reach us at <a href="mailto:contact@ecell.edu" className="text-primary hover:underline">contact@ecell.edu</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 