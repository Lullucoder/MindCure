/**
 * Centralized Validation Schemas
 * Using Zod for type-safe schema validation
 */

import { z } from 'zod';

// ============================================
// Common Validation Patterns
// ============================================

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ============================================
// Authentication Schemas
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============================================
// Profile Schemas
// ============================================

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmNewPassword: z
    .string()
    .min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

// ============================================
// Mood Tracking Schemas
// ============================================

export const moodEntrySchema = z.object({
  mood: z
    .string()
    .min(1, 'Please select a mood'),
  intensity: z
    .number()
    .min(1, 'Intensity must be at least 1')
    .max(10, 'Intensity cannot exceed 10'),
  note: z
    .string()
    .max(1000, 'Note must be less than 1000 characters')
    .optional(),
  activities: z
    .array(z.string())
    .optional(),
  triggers: z
    .array(z.string())
    .optional(),
});

// ============================================
// Community Post Schemas
// ============================================

export const postSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(20, 'Content must be at least 20 characters')
    .max(5000, 'Content must be less than 5000 characters'),
  category: z
    .string()
    .min(1, 'Please select a category'),
  tags: z
    .array(z.string())
    .max(5, 'You can add up to 5 tags')
    .optional(),
  isAnonymous: z
    .boolean()
    .optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .min(2, 'Comment must be at least 2 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
});

// ============================================
// Contact/Feedback Schemas
// ============================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Safely validate data against a schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {{ success: boolean, data?: any, errors?: Record<string, string> }}
 */
export const safeValidate = (schema, data) => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Transform Zod errors to a flat object
  const errors = {};
  result.error.errors.forEach(err => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { success: false, errors };
};

/**
 * Get error message for a specific field from Zod error
 * @param {z.ZodError} error - Zod error object
 * @param {string} field - Field name to get error for
 * @returns {string | undefined}
 */
export const getFieldError = (error, field) => {
  if (!error?.errors) return undefined;
  const fieldError = error.errors.find(e => e.path.includes(field));
  return fieldError?.message;
};
