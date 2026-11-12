import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function getNotifications(userId: string) {
  return supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
}

export async function markAsRead(notificationId: string) {
  return supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
}

export async function markAllAsRead(userId: string) {
  return supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
}
