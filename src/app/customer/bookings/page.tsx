'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, User, CheckCircle, XCircle, MessageSquare, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { getMyBookings, updateBookingStatus } from '@/features/bookings/services/booking-service';
import { getOrCreateConversation } from '@/features/messaging/services/message-service';

const statusBadgeStyles: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  confirmed: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  in_progress: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
};

export default function CustomerBookingsPage() {
  const router = useRouter();
  const { profile, isLoading: userLoading } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [messagingBookingId, setMessagingBookingId] = useState<string | null>(null);

  const handleMessageArtisan = async (booking: any) => {
    const artisanUserId =
      booking.artisan_profiles?.user_id ??
      booking.artisan_profiles?.profiles?.id ??
      booking.artisan_id;
    if (!profile?.id || !artisanUserId) return;
    setMessagingBookingId(booking.id);
    const { data } = await getOrCreateConversation({
      participant_1: profile.id,
      participant_2: artisanUserId,
      job_id: booking.job_id,
    });
    setMessagingBookingId(null);
    if (data?.id) {
      router.push(`/customer/messages?conversationId=${encodeURIComponent(data.id)}`);
    } else {
      router.push('/customer/messages');
    }
  };

  useEffect(() => {
    if (!profile?.id) {
      if (!userLoading) setLoading(false);
      return;
    }
    setLoading(true);
    getMyBookings(profile.id)
      .then(({ data }) => {
        setBookings(data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [profile?.id, userLoading]);

  const handleStatusChange = async (
    bookingId: string,
    status: 'completed' | 'cancelled'
  ) => {
    setUpdatingId(bookingId);
    const { data, error } = await updateBookingStatus(bookingId, status, {
      cancelled_by: status === 'cancelled' ? profile?.id : undefined,
    });
    if (!error && data) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? data : b))
      );
    }
    setUpdatingId(null);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'Upcoming') {
      return booking.status === 'pending' || booking.status === 'confirmed';
    }
    if (activeTab === 'In Progress') return booking.status === 'in_progress';
    if (activeTab === 'Completed') return booking.status === 'completed';
    if (activeTab === 'Cancelled') return booking.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Bookings</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Your upcoming and past bookings</p>
      </div>

      <div className="flex gap-1 rounded-md p-1" style={{ background: 'var(--color-bg-secondary)' }}>
        {['Upcoming', 'In Progress', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: activeTab === tab ? 'var(--color-surface)' : 'transparent',
              color: activeTab === tab ? 'var(--color-text)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <Calendar className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No bookings yet</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>When you accept a bid, your booking will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const badge = statusBadgeStyles[booking.status] ?? statusBadgeStyles.pending;
            const job = booking.job_requests;
            const artisanName =
              booking.artisan_profiles?.profiles?.full_name ?? 'Artisan';

            return (
              <div
                key={booking.id}
                className="rounded-md p-6 space-y-3"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {job?.categories?.name && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                        >
                          {job.categories.name}
                        </span>
                      )}
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {String(booking.status).replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {job?.title ?? 'Booked Job'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={messagingBookingId === booking.id}
                      onClick={() => handleMessageArtisan(booking)}
                      className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-semibold transition-all disabled:opacity-60"
                      style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                    >
                      {messagingBookingId === booking.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <MessageSquare className="h-3.5 w-3.5" />
                      )}
                      Message
                    </button>
                    {booking.status === 'in_progress' && (
                      <button
                        type="button"
                        disabled={updatingId === booking.id}
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
                      >
                        {updatingId === booking.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        Mark Completed
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        type="button"
                        disabled={updatingId === booking.id}
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-medium transition-all disabled:opacity-60"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                      >
                        {updatingId === booking.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="inline-flex items-center gap-1 font-semibold" style={{ color: 'var(--color-text)' }}>
                    <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
                    Agreed: ₦{Number(booking.agreed_amount ?? 0).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    Artisan: {artisanName}
                  </span>
                  {booking.created_at && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Booked {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
