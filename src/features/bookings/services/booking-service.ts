import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.types';

type BookingStatus = Database['public']['Enums']['booking_status'];

const supabase = createClient();

export async function getMyBookings(userId: string) {
  return supabase
    .from('bookings')
    .select('*, job_requests(title, category_id), artisan_profiles(profiles(full_name, avatar_url))')
    .or(`customer_id.eq.${userId},artisan_id.eq.${userId}`)
    .order('created_at', { ascending: false });
}

export async function getBookingById(bookingId: string) {
  return supabase
    .from('bookings')
    .select('*, job_requests(*), bids(*), profiles!customer_id(full_name), artisan_profiles(profiles(full_name))')
    .eq('id', bookingId)
    .single();
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  return supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);
}
