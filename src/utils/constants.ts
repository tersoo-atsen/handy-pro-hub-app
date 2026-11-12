/** Application-wide constants */

export const APP_NAME = 'Handy Pro';
export const APP_DESCRIPTION = 'Find skilled artisans near you for any home service need.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/** Default search radius in kilometers */
export const DEFAULT_SEARCH_RADIUS_KM = 10;

/** Maximum search radius in kilometers */
export const MAX_SEARCH_RADIUS_KM = 50;

/** Default bid expiry in minutes */
export const DEFAULT_BID_EXPIRY_MINUTES = 30;

/** Maximum number of bids per job */
export const MAX_BIDS_PER_JOB = 20;

/** Minimum bid amount in NGN */
export const MIN_BID_AMOUNT = 500;

/** Platform commission percentage */
export const PLATFORM_COMMISSION_PERCENT = 10;

/** Rating thresholds */
export const RATING = {
  EXCELLENT: 4.5,
  GOOD: 3.5,
  AVERAGE: 2.5,
  POOR: 1.5,
} as const;

/** Job urgency labels and colors */
export const URGENCY_CONFIG = {
  low: { label: 'Low Priority', color: 'text-slate-500', bg: 'bg-slate-100' },
  normal: { label: 'Normal', color: 'text-blue-600', bg: 'bg-blue-50' },
  urgent: { label: 'Urgent', color: 'text-amber-600', bg: 'bg-amber-50' },
  emergency: { label: 'Emergency', color: 'text-red-600', bg: 'bg-red-50' },
} as const;

/** Job status labels and colors */
export const JOB_STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'text-gray-500', bg: 'bg-gray-100' },
  open: { label: 'Open', color: 'text-green-600', bg: 'bg-green-50' },
  bidding: { label: 'Receiving Bids', color: 'text-blue-600', bg: 'bg-blue-50' },
  assigned: { label: 'Assigned', color: 'text-purple-600', bg: 'bg-purple-50' },
  in_progress: { label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-50' },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
  disputed: { label: 'Disputed', color: 'text-orange-600', bg: 'bg-orange-50' },
  resolved: { label: 'Resolved', color: 'text-teal-600', bg: 'bg-teal-50' },
} as const;

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

/** Supported categories for seeding */
export const SEED_CATEGORIES = [
  { name: 'Plumbing', slug: 'plumbing', description: 'Pipe repairs, installations, and water system maintenance' },
  { name: 'Electrical', slug: 'electrical', description: 'Wiring, installations, and electrical repairs' },
  { name: 'Carpentry', slug: 'carpentry', description: 'Furniture making, repairs, and woodwork' },
  { name: 'Painting', slug: 'painting', description: 'Interior and exterior painting services' },
  { name: 'Cleaning', slug: 'cleaning', description: 'Home and office cleaning services' },
  { name: 'AC & Refrigeration', slug: 'ac-refrigeration', description: 'Air conditioning and refrigerator repair' },
  { name: 'Tiling', slug: 'tiling', description: 'Floor and wall tiling services' },
  { name: 'Welding', slug: 'welding', description: 'Metal fabrication and welding services' },
  { name: 'Generator Repair', slug: 'generator-repair', description: 'Generator servicing and repair' },
  { name: 'Landscaping', slug: 'landscaping', description: 'Garden design, lawn care, and outdoor maintenance' },
] as const;
