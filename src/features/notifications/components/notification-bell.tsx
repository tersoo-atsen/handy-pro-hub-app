'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
  subscribeToNotifications,
} from '@/features/notifications/services/notification-service';
import type { AppNotification } from '@/features/notifications/types';

interface NotificationBellProps {
  align?: 'left' | 'right';
}

function getNotificationHref(
  notification: AppNotification,
  role: 'customer' | 'artisan' | 'admin' = 'customer'
): string {
  const isArtisan = role === 'artisan';
  const basePrefix = isArtisan ? '/artisan' : '/customer';
  const data = (notification.data ?? {}) as Record<string, unknown>;

  switch (notification.type) {
    case 'new_message': {
      const convId = data.conversation_id ? String(data.conversation_id) : '';
      return convId
        ? `${basePrefix}/messages?conversationId=${encodeURIComponent(convId)}`
        : `${basePrefix}/messages`;
    }
    case 'new_bid':
      return '/customer/jobs';
    case 'new_job_nearby':
      return '/artisan/jobs';
    case 'bid_rejected':
      return '/artisan/bids';
    case 'bid_accepted':
    case 'booking_confirmed':
    case 'job_started':
    case 'job_completed':
    case 'payment_received':
      return `${basePrefix}/bookings`;
    case 'new_review':
      return `${basePrefix}/profile`;
    default:
      if (data.conversation_id) {
        return `${basePrefix}/messages?conversationId=${encodeURIComponent(String(data.conversation_id))}`;
      }
      if (data.booking_id) {
        return `${basePrefix}/bookings`;
      }
      if (data.job_id) {
        return isArtisan ? '/artisan/jobs' : '/customer/jobs';
      }
      return `${basePrefix}/dashboard`;
  }
}

export function NotificationBell({ align = 'right' }: NotificationBellProps) {
  const router = useRouter();
  const { profile } = useUser();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile?.id) return;
    getNotifications(profile.id).then(({ data }) => {
      setNotifications(data ?? []);
    });

    return subscribeToNotifications(profile.id, (incoming) => {
      setNotifications((prev) =>
        prev.some((n) => n.id === incoming.id) ? prev : [incoming, ...prev]
      );
    });
  }, [profile?.id]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    }
    setIsOpen(false);
    const targetHref = getNotificationHref(notification, profile?.role);
    router.push(targetHref);
  };

  const handleMarkAllRead = async () => {
    if (!profile?.id) return;
    await markAllAsRead(profile.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="relative h-9 w-9 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--color-surface-hover)]"
        style={{ color: 'var(--color-text-secondary)' }}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full px-1 text-[10px] font-bold flex items-center justify-center text-white gradient-primary"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'left' ? 'left-0' : 'right-0'
          } mt-2 w-80 max-w-[calc(100vw-2rem)] max-h-96 overflow-y-auto rounded-md p-4 z-50 space-y-3`}
          style={{
            background: 'var(--color-surface)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: 'var(--color-text-secondary)' }}>
              No notifications yet
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className="w-full text-left rounded-md p-3 transition-all block cursor-pointer hover:bg-[var(--color-surface-hover)]"
                  style={{
                    background: n.is_read ? 'transparent' : 'var(--color-primary-50)',
                    border: `1px solid ${n.is_read ? 'var(--color-border-light)' : 'var(--color-primary-200)'}`,
                  }}
                >
                  <p className="text-xs font-semibold">{n.title}</p>
                  {n.body && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                      {n.body}
                    </p>
                  )}
                  {n.created_at && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
