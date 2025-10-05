import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Game validation schemas
export const createGameSchema = z.object({
  timeControl: z.object({
    type: z.enum(['blitz', 'rapid', 'classical']),
    initial: z.number().min(1).max(180),
    increment: z.number().min(0).max(60),
    label: z.string(),
  }),
  colorPreference: z.enum(['white', 'black', 'random']),
  isPublic: z.boolean(),
});

export const joinGameSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
});

export const makeMoveSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
  from: z.string().regex(/^[a-h][1-8]$/, 'Invalid from square'),
  to: z.string().regex(/^[a-h][1-8]$/, 'Invalid to square'),
  promotion: z.string().optional(),
});

// Profile validation schemas
export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
});

// Utility functions
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const validateUsername = (username: string): boolean => {
  return z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).safeParse(username).success;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const { isValid, errors } = validatePassword(password);
  
  if (!isValid) return 'weak';
  
  if (password.length >= 12 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'strong';
  }
  
  if (password.length >= 10) {
    return 'medium';
  }
  
  return 'weak';
};

export const validateChessMove = (from: string, to: string): boolean => {
  const squareRegex = /^[a-h][1-8]$/;
  return squareRegex.test(from) && squareRegex.test(to);
};

export const validatePromotion = (promotion: string): boolean => {
  return ['Q', 'R', 'B', 'N', 'q', 'r', 'b', 'n'].includes(promotion);
};