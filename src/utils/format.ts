import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a number as Nigerian Naira currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string as a human-readable date.
 */
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}

/**
 * Format a date string as a relative time (e.g., "5 minutes ago").
 */
export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

/**
 * Format a distance in kilometers.
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`;
  }
  return `${km.toFixed(1)}km away`;
}

/**
 * Format a rating to one decimal place.
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
