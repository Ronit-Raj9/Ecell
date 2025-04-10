'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { signup } from '@/redux/slices/authSlice';

// Valid branch codes
const VALID_BRANCHES = ['EEE', 'BMS', 'BCS', 'IMG', 'IMT'];

// Roll number format regex
const ROLL_NUMBER_REGEX = /^(20\d{2})(EEE|BMS|BCS|IMG|IMT)-(\d{3})$/;

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roll_no: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [extractedInfo, setExtractedInfo] = useState<{branch: string; year: number | null}>({
    branch: '',
    year: null
  });
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  // Calculate student year based on enrollment year
  const calculateStudentYear = (enrollmentYear: number): number => {
    const currentDate = new Date();
    const enrollmentDate = new Date(enrollmentYear, 7, 1); // August 1st of enrollment year
    
    const diffTime = currentDate.getTime() - enrollmentDate.getTime();
    const diffYears = diffTime / (1000 * 3600 * 24 * 365.25); // Account for leap years
    
    if (diffYears < 1) return 1;
    if (diffYears < 2) return 2;
    if (diffYears < 3) return 3;
    if (diffYears < 4) return 4;
    if (diffYears < 5) return 5;
    return 5; // 5+ year
  };

  // Extract info from roll number
  const extractRollNumberInfo = (rollNo: string) => {
    const match = rollNo.match(ROLL_NUMBER_REGEX);
    
    if (!match) {
      return { branch: '', year: null };
    }
    
    const enrollmentYear = parseInt(match[1], 10);
    const branch = match[2];
    const year = calculateStudentYear(enrollmentYear);
    
    return { branch, year };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Extract branch and year when roll number changes
    if (name === 'roll_no') {
      setExtractedInfo(extractRollNumberInfo(value));
    }
    
    // Clear error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.roll_no.trim()) {
      newErrors.roll_no = 'Roll number is required';
    } else if (!ROLL_NUMBER_REGEX.test(formData.roll_no)) {
      newErrors.roll_no = `Roll number must be in format YYYYBBB-NNN where BBB is one of: ${VALID_BRANCHES.join(', ')}`;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Remove confirmPassword from data sent to API
    const { confirmPassword, ...signupData } = formData;
    
    // Only send roll_no, backend will derive branch and year
    dispatch(signup(signupData));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Roll Number
              </label>
              <div className="mt-1">
                <input
                  id="roll_no"
                  name="roll_no"
                  type="text"
                  placeholder="e.g., 2023BMS-025"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.roll_no ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                  value={formData.roll_no}
                  onChange={handleChange}
                />
                {validationErrors.roll_no && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.roll_no}</p>
                )}
                {extractedInfo.branch && extractedInfo.year && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    Branch: {extractedInfo.branch}, Year: {extractedInfo.year}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format: YYYYBBB-NNN where BBB is one of: {VALID_BRANCHES.join(', ')}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 