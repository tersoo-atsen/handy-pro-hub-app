'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Send, User, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import {
  getConversations,
  getMessages,
  sendMessage,
  subscribeToMessages,
} from '@/features/messaging/services/message-service';

export default function CustomerMessagesPage() {
  const { profile, isLoading: userLoading } = useUser();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!profile?.id) {
      if (!userLoading) setLoadingConversations(false);
      return;
    }
    setLoadingConversations(true);
    getConversations(profile.id)
      .then(({ data }) => {
        const list = data ?? [];
        setConversations(list);
        if (list.length > 0) {
          const params = new URLSearchParams(window.location.search);
          const requestedId = params.get('conversationId');
          const match = requestedId ? list.find((c) => c.id === requestedId) : null;
          setSelectedConversation(match ?? list[0]);
        }
      })
      .finally(() => {
        setLoadingConversations(false);
      });
  }, [profile?.id, userLoading]);

  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    getMessages(selectedConversation.id)
      .then(({ data }) => {
        setMessages(data ?? []);
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!profile?.id) return;
    return subscribeToMessages(profile.id, ({ conversationId, message }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, last_message: message.content, last_message_at: message.created_at }
            : c
        )
      );
      if (selectedConversation?.id === conversationId) {
        setMessages((prev) =>
          prev.some((m) => m.id === message.id) ? prev : [...prev, message]
        );
      }
    });
  }, [profile?.id, selectedConversation?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !selectedConversation?.id || !draft.trim()) return;
    const content = draft.trim();
    setSending(true);
    const { data, error } = await sendMessage(selectedConversation.id, profile.id, content);
    setSending(false);
    if (!error && data) {
      setDraft('');
      setMessages((prev) =>
        prev.some((m) => m.id === data.id) ? prev : [...prev, data]
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, last_message: content, last_message_at: data.created_at }
            : c
        )
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Messages</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Chat with artisans about your jobs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6" style={{ minHeight: '60vh' }}>
        {/* Conversation list */}
        <div
          className="md:col-span-1 rounded-2xl p-4 space-y-2 overflow-y-auto"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
        >
          {loadingConversations ? (
            <div className="text-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = selectedConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConversation(conv)}
                  className="w-full text-left rounded-xl p-3 transition-all flex items-start gap-3"
                  style={{
                    background: isSelected ? 'var(--color-primary-50)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'transparent'}`,
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-bg-secondary)' }}
                  >
                    <User className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{conv.other_user_name ?? 'Artisan'}</p>
                    {conv.job_title && (
                      <p className="text-xs truncate" style={{ color: 'var(--color-primary)' }}>
                        {conv.job_title}
                      </p>
                    )}
                    {conv.last_message && (
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                        {conv.last_message}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Chat area */}
        <div
          className="md:col-span-2 rounded-2xl flex flex-col overflow-hidden"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
        >
          {!selectedConversation ? (
            <div className="flex-1 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
                  <MessageSquare className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No messages</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Start a conversation by posting a job and accepting bids</p>
              </div>
            </div>
          ) : (
            <>
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--color-border-light)' }}
              >
                <div>
                  <h3 className="font-semibold text-sm">{selectedConversation.other_user_name ?? 'Artisan'}</h3>
                  {selectedConversation.job_title && (
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      Job: {selectedConversation.job_title}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 p-6 space-y-3 overflow-y-auto" style={{ maxHeight: '45vh' }}>
                {loadingMessages ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" style={{ color: 'var(--color-primary)' }} />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm py-12" style={{ color: 'var(--color-text-secondary)' }}>
                    No messages yet. Say hello!
                  </p>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === profile?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm"
                          style={{
                            background: isMine ? 'var(--color-primary-50)' : 'var(--color-bg-secondary)',
                            color: 'var(--color-text)',
                            border: `1px solid ${isMine ? 'var(--color-primary-200)' : 'var(--color-border-light)'}`,
                          }}
                        >
                          <p>{msg.content}</p>
                          {msg.created_at && (
                            <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="p-4 flex items-center gap-2"
                style={{ borderTop: '1px solid var(--color-border-light)' }}
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white gradient-primary disabled:opacity-60"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
