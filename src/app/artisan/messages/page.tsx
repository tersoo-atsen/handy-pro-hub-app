import { MessageSquare } from 'lucide-react';

export default function ArtisanMessagesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Messages</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Communicate with customers</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6" style={{ minHeight: '60vh' }}>
        <div
          className="md:col-span-1 rounded-2xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="text-center py-12">
            <MessageSquare className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No conversations yet</p>
          </div>
        </div>
        <div
          className="md:col-span-2 rounded-2xl p-8 flex items-center justify-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
              <MessageSquare className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No messages</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Conversations with customers will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
