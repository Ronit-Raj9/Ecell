'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const upcomingEvents = [
  {
    id: 1,
    title: 'Startup Pitch Competition',
    date: 'May 15, 2024',
    time: '3:00 PM - 6:00 PM',
    location: 'Main Auditorium',
    description: 'Showcase your startup idea to investors and win funding opportunities.',
    image: '/event1.jpg', // You can add event images later
  },
  {
    id: 2,
    title: 'Workshop: Business Model Canvas',
    date: 'May 22, 2024',
    time: '2:00 PM - 4:00 PM',
    location: 'Room 204, Business Building',
    description: 'Learn how to create an effective business model for your startup.',
    image: '/event2.jpg',
  },
  {
    id: 3,
    title: 'Entrepreneurship Networking Mixer',
    date: 'June 5, 2024',
    time: '5:00 PM - 7:00 PM',
    location: 'Innovation Hub',
    description: 'Connect with fellow entrepreneurs, mentors, and industry professionals.',
    image: '/event3.jpg',
  },
];

export default function EventsSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Upcoming <span className="text-primary">Events</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join us for exciting workshops, hackathons, and networking events to enhance
              your entrepreneurial journey.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-primary/20 flex items-center justify-center">
                <div className="text-4xl text-primary">📅</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                    {event.date}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event.time}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.location}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {event.description}
                </p>
                <div className="flex justify-between items-center">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    Register Now
                  </button>
                  <button className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                    Learn More
                  </button>
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
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View All Events
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