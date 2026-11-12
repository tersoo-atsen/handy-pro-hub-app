import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function getConversations(userId: string) {
  return supabase
    .from('conversations')
    .select('*')
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('last_message_at', { ascending: false });
}

export async function getMessages(conversationId: string) {
  return supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  return supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
  });
}
