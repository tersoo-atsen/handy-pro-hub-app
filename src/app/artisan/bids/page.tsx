'use client';

import { useEffect, useState } from 'react';
import { Gavel, Clock, DollarSign, Loader2, XCircle } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { getMyBids, withdrawBid } from '@/features/bidding/services/bid-service';

const statusBadgeStyles: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  accepted: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  withdrawn: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
  expired: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
};

export default function ArtisanBidsPage() {
  const { profile, isLoading: userLoading } = useUser();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) {
      if (!userLoading) setLoading(false);
      return;
    }
    setLoading(true);
    getMyBids(profile.id)
      .then(({ data }) => {
        setBids(data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [profile?.id, userLoading]);

  const handleWithdraw = async (bidId: string) => {
    setWithdrawingId(bidId);
    const { error } = await withdrawBid(bidId);
    if (!error) {
      setBids((prev) =>
        prev.map((b) => (b.id === bidId ? { ...b, status: 'withdrawn' } : b))
      );
    }
    setWithdrawingId(null);
  };

  const filteredBids = bids.filter((bid) => {
    if (activeTab === 'All') return true;
    return bid.status === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>My Bids</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track your submitted bids and their status</p>
      </div>

      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--color-bg-secondary)' }}>
        {['All', 'Pending', 'Accepted', 'Rejected', 'Expired'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all"
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
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading your bids...</p>
        </div>
      ) : filteredBids.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <Gavel className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No bids yet</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Browse nearby jobs and place your first bid</p>
          <a href="/artisan/jobs" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid) => {
            const badge = statusBadgeStyles[bid.status] ?? statusBadgeStyles.pending;
            const job = bid.job_requests;
            return (
              <div
                key={bid.id}
                className="rounded-2xl p-6 space-y-3"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className="flex items-start justify-between gap-4">
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
                        {bid.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {job?.title ?? 'Job Request'}
                    </h3>
                  </div>

                  {bid.status === 'pending' && (
                    <button
                      type="button"
                      disabled={withdrawingId === bid.id}
                      onClick={() => handleWithdraw(bid.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-60"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                    >
                      {withdrawingId === bid.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      Withdraw
                    </button>
                  )}
                </div>

                {bid.message && (
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {bid.message}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="inline-flex items-center gap-1 font-semibold" style={{ color: 'var(--color-text)' }}>
                    <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
                    Bid: ₦{Number(bid.amount ?? 0).toLocaleString()}
                  </span>
                  {bid.estimated_hours != null && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Est. {Number(bid.estimated_hours)} hrs
                    </span>
                  )}
                  {bid.created_at && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Submitted {new Date(bid.created_at).toLocaleDateString()}
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
