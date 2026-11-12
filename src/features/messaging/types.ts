export interface Conversation {
  id: string;
  job_id: string | null;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
  // Joined
  other_user_name?: string;
  other_user_avatar?: string;
  last_message?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}
