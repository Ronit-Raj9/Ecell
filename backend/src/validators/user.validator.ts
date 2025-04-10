import { z } from 'zod';

// Valid branch codes
const VALID_BRANCHES = ['EEE', 'BMS', 'BCS', 'IMG', 'IMT'];

// Roll number format validation regex: YYYYBBB-NNN
// Where YYYY is year, BBB is branch code, NNN is student number
const rollNumberRegex = /^(20\d{2})(EEE|BMS|BCS|IMG|IMT)-(\d{3})$/;

// User signup validation
export const signupValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roll_no: z.string()
    .regex(rollNumberRegex, `Roll number must be in format YYYYBBB-NNN where BBB is one of: ${VALID_BRANCHES.join(', ')}`)
});

// User login validation
export const loginValidator = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// User profile update validation
export const updateProfileValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional()
});

// Update user role validation (admin only)
export const updateRoleValidator = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['member', 'admin', 'superadmin'], {
    errorMap: () => ({ message: 'Role must be either member, admin, or superadmin' })
  })
}); 