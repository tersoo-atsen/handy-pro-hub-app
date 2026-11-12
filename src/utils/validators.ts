import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const artisanOnboardingSchema = z.object({
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(500),
  years_experience: z.number().min(0).max(50),
  hourly_rate: z.number().min(500, 'Minimum rate is ₦500').max(100000),
  service_radius_km: z.number().min(1).max(100),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
});

export const jobRequestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category_id: z.string().uuid('Please select a category'),
  urgency: z.enum(['low', 'normal', 'urgent', 'emergency']),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  address: z.string().min(5, 'Please provide an address'),
  scheduled_at: z.string().optional(),
}).refine(
  (data) => {
    if (data.budget_min && data.budget_max) {
      return data.budget_min <= data.budget_max;
    }
    return true;
  },
  {
    message: 'Minimum budget cannot exceed maximum budget',
    path: ['budget_max'],
  }
);

export const bidSchema = z.object({
  amount: z.number().min(500, 'Minimum bid is ₦500'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500),
  estimated_hours: z.number().min(0.5).max(200).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

// Infer types from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ArtisanOnboardingInput = z.infer<typeof artisanOnboardingSchema>;
export type JobRequestInput = z.infer<typeof jobRequestSchema>;
export type BidInput = z.infer<typeof bidSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
