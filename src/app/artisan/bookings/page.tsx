'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, User, Play, CheckCircle, XCircle, MessageSquare, Star, Loader2, Landmark } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { getMyBookings, updateBookingStatus } from '@/features/bookings/services/booking-service';
import { getOrCreateConversation } from '@/features/messaging/services/message-service';
import {
  getMyPayments,
  getPaystackBanks,
  payoutBookingViaPaystack,
  type PaymentRecord,
  type PaystackBank,
} from '@/features/payments/services/payment-service';
import { ReviewForm } from '@/features/reviews/components/review-form';

const statusBadgeStyles: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  confirmed: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  in_progress: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
};

export default function ArtisanBookingsPage() {
  const router = useRouter();
  const { profile, isLoading: userLoading } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [messagingBookingId, setMessagingBookingId] = useState<string | null>(null);
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [banks, setBanks] = useState<PaystackBank[]>([]);
  const [payoutBookingId, setPayoutBookingId] = useState<string | null>(null);
  const [payoutForm, setPayoutForm] = useState({
    bank_code: '',
    account_number: '',
    account_name: '',
  });
  const [submittingPayoutId, setSubmittingPayoutId] = useState<string | null>(null);
  const [payoutMessage, setPayoutMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleMessageCustomer = async (booking: any) => {
    if (!profile?.id || !booking.customer_id) return;
    setMessagingBookingId(booking.id);
    const { data } = await getOrCreateConversation({
      participant_1: profile.id,
      participant_2: booking.customer_id,
      job_id: booking.job_id,
    });
    setMessagingBookingId(null);
    if (data?.id) {
      router.push(`/artisan/messages?conversationId=${encodeURIComponent(data.id)}`);
    } else {
      router.push('/artisan/messages');
    }
  };

  useEffect(() => {
    if (!profile?.id) {
      if (!userLoading) setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([getMyBookings(profile.id), getMyPayments(profile.id)])
      .then(([bookingsRes, paymentsRes]) => {
        setBookings(bookingsRes.data ?? []);
        setPayments(paymentsRes.data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [profile?.id, userLoading]);

  const handleOpenPayout = async (bookingId: string) => {
    setPayoutMessage(null);
    if (payoutBookingId === bookingId) {
      setPayoutBookingId(null);
      return;
    }
    setPayoutBookingId(bookingId);
    if (banks.length === 0) {
      const { data } = await getPaystackBanks();
      if (data) setBanks(data);
    }
  };

  const handleSubmitPayout = async (e: React.FormEvent, bookingId: string) => {
    e.preventDefault();
    if (!payoutForm.bank_code || !payoutForm.account_number.trim()) return;
    setPayoutMessage(null);
    setSubmittingPayoutId(bookingId);
    const { data, error } = await payoutBookingViaPaystack(bookingId, {
      bank_code: payoutForm.bank_code,
      account_number: payoutForm.account_number.trim(),
      account_name: payoutForm.account_name.trim() || undefined,
    });
    setSubmittingPayoutId(null);

    if (error || !data) {
      setPayoutMessage({
        type: 'error',
        text: error?.message ?? 'Failed to process payout.',
      });
      return;
    }

    setPayments((prev) =>
      prev.map((p) => (p.id === data.payment.id ? data.payment : p))
    );
    setPayoutBookingId(null);
    setPayoutMessage({
      type: 'success',
      text: `Payout of ₦${data.net_amount.toLocaleString()} initiated (₦${data.platform_fee.toLocaleString()} platform commission retained).`,
    });
  };

  const handleStatusChange = async (
    bookingId: string,
    status: 'in_progress' | 'completed' | 'cancelled'
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
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your upcoming and completed jobs</p>
      </div>

      {payoutMessage && (
        <div
          className="rounded-md px-4 py-3 text-sm font-medium"
          style={{
            background:
              payoutMessage.type === 'success'
                ? 'rgba(16,185,129,0.1)'
                : 'rgba(239,68,68,0.1)',
            color: payoutMessage.type === 'success' ? '#10B981' : '#EF4444',
          }}
        >
          {payoutMessage.text}
        </div>
      )}

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
          <p style={{ color: 'var(--color-text-secondary)' }}>When a customer accepts your bid, the booking will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const badge = statusBadgeStyles[booking.status] ?? statusBadgeStyles.pending;
            const job = booking.job_requests;
            const customerName =
              booking.profiles_bookings_customer_idToprofiles?.full_name ?? 'Customer';
            const myReview = Array.isArray(booking.reviews)
              ? booking.reviews.find((r: any) => r.reviewer_id === profile?.id)
              : null;
            const completedPayment = payments.find(
              (p) => p.booking_id === booking.id && p.status === 'completed'
            );
            const isPaidOut = completedPayment?.provider === 'paystack_paid_out';

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
                      onClick={() => handleMessageCustomer(booking)}
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
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        type="button"
                        disabled={updatingId === booking.id}
                        onClick={() => handleStatusChange(booking.id, 'in_progress')}
                        className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
                      >
                        {updatingId === booking.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                        Start Job
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        Awaiting customer approval
                      </span>
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
                    {booking.status === 'completed' && completedPayment && (
                      isPaidOut ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Paid Out (₦{Number(completedPayment.net_amount ?? 0).toLocaleString()})
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenPayout(booking.id)}
                          className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-semibold text-white gradient-primary"
                        >
                          <Landmark className="h-3.5 w-3.5" />
                          Withdraw ₦{Number(completedPayment.net_amount ?? 0).toLocaleString()}
                        </button>
                      )
                    )}
                    {booking.status === 'completed' && !myReview && (
                      <button
                        type="button"
                        onClick={() =>
                          setReviewingBookingId(
                            reviewingBookingId === booking.id ? null : booking.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary"
                      >
                        <Star className="h-3.5 w-3.5" />
                        Leave Review
                      </button>
                    )}
                    {booking.status === 'completed' && myReview && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}
                      >
                        <Star className="h-3.5 w-3.5" style={{ fill: '#F59E0B' }} />
                        Reviewed ({myReview.rating}/5)
                      </span>
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
                    Customer: {customerName}
                  </span>
                  {booking.created_at && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Booked {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {payoutBookingId === booking.id && completedPayment && !isPaidOut && (
                  <form
                    onSubmit={(e) => handleSubmitPayout(e, booking.id)}
                    className="pt-4 space-y-3"
                    style={{ borderTop: '1px solid var(--color-border-light)' }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold">Payout Details</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        Gross: ₦{Number(completedPayment.amount ?? 0).toLocaleString()} · Platform Fee: ₦{Number(completedPayment.platform_fee ?? 0).toLocaleString()} · Net: ₦{Number(completedPayment.net_amount ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        required
                        value={payoutForm.bank_code}
                        onChange={(e) =>
                          setPayoutForm({ ...payoutForm, bank_code: e.target.value })
                        }
                        className="w-full rounded-md px-3 py-2 text-sm outline-none"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        <option value="">Select bank</option>
                        {banks.map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        required
                        placeholder="Account number (10 digits)"
                        value={payoutForm.account_number}
                        onChange={(e) =>
                          setPayoutForm({ ...payoutForm, account_number: e.target.value })
                        }
                        className="w-full rounded-md px-3 py-2 text-sm outline-none"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Account name (optional)"
                        value={payoutForm.account_name}
                        onChange={(e) =>
                          setPayoutForm({ ...payoutForm, account_name: e.target.value })
                        }
                        className="w-full rounded-md px-3 py-2 text-sm outline-none"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPayoutBookingId(null)}
                        className="rounded-md px-3.5 py-2 text-xs font-medium"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingPayoutId === booking.id}
                        className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
                      >
                        {submittingPayoutId === booking.id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Confirm Payout
                      </button>
                    </div>
                  </form>
                )}

                {reviewingBookingId === booking.id && profile?.id && booking.customer_id && (
                  <ReviewForm
                    bookingId={booking.id}
                    reviewerId={profile.id}
                    revieweeId={booking.customer_id}
                    revieweeName={customerName}
                    onSubmitted={(review) => {
                      setBookings((prev) =>
                        prev.map((b) =>
                          b.id === booking.id
                            ? { ...b, reviews: [...(b.reviews ?? []), review] }
                            : b
                        )
                      );
                      setReviewingBookingId(null);
                    }}
                    onCancel={() => setReviewingBookingId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
