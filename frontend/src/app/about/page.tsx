import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About <span className="text-primary">E-Cell</span>
        </h1>
        <div className="w-24 h-1 bg-primary mb-10"></div>
        
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The Entrepreneurship Cell (E-Cell) was established in 2015 with a mission to foster the spirit of entrepreneurship among students. 
              What started as a small group of passionate students has now grown into a vibrant community of innovators, mentors, and industry leaders.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Through the years, we have organized numerous workshops, hackathons, speaker sessions, and pitch competitions to provide students with 
              practical exposure and networking opportunities in the startup ecosystem.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Mission & Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Mission:</strong> To cultivate an entrepreneurial mindset among students and provide them with the resources, mentorship, 
              and platforms needed to transform their innovative ideas into successful ventures.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Vision:</strong> We envision creating a thriving ecosystem where students can explore entrepreneurship, gain practical experience, 
              and develop the skills necessary to become future business leaders and innovators.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-primary mb-3">Events & Workshops</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We organize various events, workshops, and speaker sessions to provide students with insights into entrepreneurship.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-primary mb-3">Skill Development</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We conduct training programs to develop essential entrepreneurial skills among students.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 