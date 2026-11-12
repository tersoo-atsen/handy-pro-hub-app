/**
 * Generate a simple geohash from latitude and longitude.
 * Uses a basic base32 encoding approach.
 */

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function encodeGeohash(
  latitude: number,
  longitude: number,
  precision: number = 6
): string {
  const latRange = { min: -90, max: 90 };
  const lngRange = { min: -180, max: 180 };
  let isLng = true;
  let bit = 0;
  let ch = 0;
  let hash = '';

  while (hash.length < precision) {
    const range = isLng ? lngRange : latRange;
    const val = isLng ? longitude : latitude;
    const mid = (range.min + range.max) / 2;

    if (val >= mid) {
      ch |= 1 << (4 - bit);
      range.min = mid;
    } else {
      range.max = mid;
    }

    isLng = !isLng;
    bit++;

    if (bit === 5) {
      hash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }

  return hash;
}

/**
 * Calculate the distance between two coordinates using the Haversine formula.
 * Returns distance in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get the neighboring geohash prefixes for a given geohash.
 * Useful for subscribing to nearby Realtime channels.
 */
export function getNeighborPrefixes(geohash: string, prefixLength: number = 4): string[] {
  const prefix = geohash.slice(0, prefixLength);
  // For simplicity, return the prefix itself.
  // A full implementation would compute adjacent geohash cells.
  return [prefix];
}
