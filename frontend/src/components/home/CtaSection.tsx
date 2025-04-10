'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setFormState('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
      setEmail('');
      
      // Reset form state after 3 seconds
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="relative py-24 overflow-hidden">
      {/* Gradient Backgrounds */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-30"></div>
        <div className="dot-pattern absolute inset-0 opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="card-3d max-w-4xl mx-auto p-1 bg-gradient-to-r from-primary to-accent rounded-2xl overflow-hidden">
            <div className="bg-black/80 backdrop-blur-lg rounded-xl p-10 md:p-14 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center space-y-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Join Our <span className="gradient-text">Community</span> Today
                </h2>
                <p className="text-white/80 max-w-2xl mx-auto text-lg font-light">
                  Subscribe to our newsletter to stay updated with the latest events, 
                  workshops, and opportunities in entrepreneurship and innovation.
                </p>
                
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 
                                 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={formState === 'submitting' || formState === 'success'}
                        required
                      />
                      {formState === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm rounded-xl"
                        >
                          <div className="flex items-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Subscribed successfully!</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={formState === 'submitting' || formState === 'success'}
                      className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium 
                              shadow-lg hover:shadow-xl transform transition-all duration-300 flex-shrink-0
                              focus:ring-2 focus:ring-white/30 focus:outline-none disabled:opacity-70"
                    >
                      {formState === 'submitting' ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </div>
                      ) : "Subscribe"}
                    </motion.button>
                  </form>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
                  <Link href="/join" className="flex items-center hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Become a Member
                  </Link>
                  <Link href="/contact" className="flex items-center hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 