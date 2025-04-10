'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Resources', href: '/resources' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
            <span className="text-xl font-bold text-white">EC</span>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <span className="text-2xl font-bold text-white">
              E-<span className="gradient-text">Cell</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <div className="flex items-center bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? 'text-white bg-gradient-to-r from-primary to-accent shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Admin panel link for admin users */}
          {isAuthenticated && isAdmin && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2"
            >
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  pathname.startsWith('/admin')
                    ? 'text-white bg-gradient-to-r from-primary to-accent shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                Admin
              </Link>
            </motion.div>
          )}

          <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/10">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full text-white/90 border border-white/20 hover:bg-white/5 backdrop-blur-sm shadow-sm transition-all duration-300"
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full text-white/90 border border-white/20 hover:bg-white/5 backdrop-blur-sm shadow-sm transition-all duration-300"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none z-50 relative"
            aria-label="Toggle menu"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <span className={`hamburger-line top ${mobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line middle ${mobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line bottom ${mobileMenuOpen ? 'active' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col bg-black/80 backdrop-blur-xl pt-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-1 px-4 pt-8 pb-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-white bg-gradient-to-r from-primary to-accent shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Admin panel link for admin users */}
              {isAuthenticated && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: navItems.length * 0.05 }}
                >
                  <Link
                    href="/admin"
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${
                      pathname.startsWith('/admin')
                        ? 'text-white bg-gradient-to-r from-primary to-accent shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Admin
                  </Link>
                </motion.div>
              )}
            </div>

            <div className="mt-auto p-6 border-t border-white/10">
              <div className="grid grid-cols-1 gap-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-center px-4 py-3 rounded-xl text-white border border-white/20 hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-center px-4 py-3 rounded-xl text-white border border-white/20 hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="text-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 