'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Plus, MapPin, DollarSign, Clock, Gavel, CheckCircle, MessageSquare, Loader2, Pencil, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { deleteJob, getMyJobs, updateJob } from '@/features/jobs/services/job-service';
import { getBidsForJob, acceptBid } from '@/features/bidding/services/bid-service';
import { getOrCreateConversation } from '@/features/messaging/services/message-service';
import { VerificationBadge } from '@/features/artisans/components/verification-badge';
import type { JobRequest } from '@/features/jobs/types';

export default function CustomerJobsPage() {
  const router = useRouter();
  const { profile, isLoading: userLoading } = useUser();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobBids, setJobBids] = useState<Record<string, any[]>>({});
  const [loadingBidsJobId, setLoadingBidsJobId] = useState<string | null>(null);
  const [acceptingBidId, setAcceptingBidId] = useState<string | null>(null);
  const [messagingBidId, setMessagingBidId] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    urgency: 'normal' as JobRequest['urgency'],
    budget_min: '',
    budget_max: '',
    address: '',
  });
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [confirmDeleteJobId, setConfirmDeleteJobId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const canEditJob = (status: string) => ['draft', 'open', 'bidding'].includes(status);

  const startEditingJob = (job: any) => {
    setConfirmDeleteJobId(null);
    setEditingJobId(job.id);
    setEditForm({
      title: job.title ?? '',
      description: job.description ?? '',
      urgency: job.urgency ?? 'normal',
      budget_min: job.budget_min != null ? String(job.budget_min) : '',
      budget_max: job.budget_max != null ? String(job.budget_max) : '',
      address: job.address ?? '',
    });
  };

  const handleSaveJob = async (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    setSavingJobId(jobId);
    const { data, error } = await updateJob(jobId, {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      urgency: editForm.urgency,
      budget_min: editForm.budget_min ? Number(editForm.budget_min) : undefined,
      budget_max: editForm.budget_max ? Number(editForm.budget_max) : undefined,
      address: editForm.address.trim() || undefined,
    });
    if (!error && data) {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...data } : j)));
      setEditingJobId(null);
    }
    setSavingJobId(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    setDeletingJobId(jobId);
    const { error } = await deleteJob(jobId);
    if (!error) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setConfirmDeleteJobId(null);
      if (editingJobId === jobId) setEditingJobId(null);
    }
    setDeletingJobId(null);
  };

  const handleMessageBidder = async (jobId: string, bid: any) => {
    const artisanUserId = bid.artisan_profiles?.user_id ?? bid.artisan_profiles?.profiles?.id ?? bid.artisan_id;
    if (!profile?.id || !artisanUserId) return;
    setMessagingBidId(bid.id);
    const { data } = await getOrCreateConversation({
      participant_1: profile.id,
      participant_2: artisanUserId,
      job_id: jobId,
    });
    setMessagingBidId(null);
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
    getMyJobs(profile.id)
      .then(({ data }) => {
        setJobs(data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [profile?.id, userLoading]);

  const handleToggleBids = async (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    setExpandedJobId(jobId);
    setLoadingBidsJobId(jobId);
    const { data } = await getBidsForJob(jobId);
    setJobBids((prev) => ({ ...prev, [jobId]: data ?? [] }));
    setLoadingBidsJobId(null);
  };

  const handleAcceptBid = async (jobId: string, bidId: string) => {
    if (!profile?.id) return;
    setAcceptingBidId(bidId);
    const { error } = await acceptBid(bidId, profile.id);
    if (!error) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'assigned' } : j))
      );
      setJobBids((prev) => ({
        ...prev,
        [jobId]: (prev[jobId] ?? []).map((b) => ({
          ...b,
          status: b.id === bidId ? 'accepted' : b.status === 'pending' ? 'rejected' : b.status,
        })),
      }));
    }
    setAcceptingBidId(null);
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') {
      return ['open', 'bidding', 'assigned', 'in_progress'].includes(job.status);
    }
    if (activeTab === 'Completed') return job.status === 'completed';
    if (activeTab === 'Cancelled') return job.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>My Jobs</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track and manage your job requests</p>
        </div>
        <Link
          href="/customer/jobs/new"
          className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white gradient-primary hover:scale-105 transition-transform"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <Plus className="h-4 w-4" />
          New Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-md p-1" style={{ background: 'var(--color-bg-secondary)' }}>
        {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
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

      {/* Results / Empty state */}
      {loading ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading your jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <Briefcase className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No jobs yet</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Create your first job request to find skilled artisans</p>
          <Link
            href="/customer/jobs/new"
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white gradient-primary"
          >
            <Plus className="h-4 w-4" /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job: any) => {
            const isExpanded = expandedJobId === job.id;
            const bidsForJob = jobBids[job.id] ?? [];
            return (
              <div
                key={job.id}
                className="rounded-md p-6 space-y-3"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {(job.categories?.name || job.category_name) && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                        >
                          {job.categories?.name ?? job.category_name}
                        </span>
                      )}
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
                      >
                        {job.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {job.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {canEditJob(job.status) && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            editingJobId === job.id ? setEditingJobId(null) : startEditingJob(job)
                          }
                          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-all"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        {confirmDeleteJobId === job.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={deletingJobId === job.id}
                              onClick={() => handleDeleteJob(job.id)}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-semibold text-white disabled:opacity-60"
                              style={{ backgroundColor: '#EF4444' }}
                            >
                              {deletingJobId === job.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                'Confirm'
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={deletingJobId === job.id}
                              onClick={() => setConfirmDeleteJobId(null)}
                              className="inline-flex items-center rounded-md px-2.5 py-2 text-xs font-medium"
                              style={{
                                background: 'var(--color-bg-secondary)',
                                color: 'var(--color-text-secondary)',
                                border: '1px solid var(--color-border)',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteJobId(job.id)}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-medium transition-all"
                            style={{
                              background: 'var(--color-bg-secondary)',
                              color: '#EF4444',
                              border: '1px solid var(--color-border)',
                            }}
                            aria-label="Delete job"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleBids(job.id)}
                      className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-semibold transition-all"
                      style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                    >
                      <Gavel className="h-3.5 w-3.5" />
                      {isExpanded ? 'Hide Bids' : `View Bids (${job.bid_count ?? 0})`}
                    </button>
                  </div>
                </div>

                {editingJobId === job.id ? (
                  <form
                    onSubmit={(e) => handleSaveJob(e, job.id)}
                    className="pt-3 space-y-3"
                    style={{ borderTop: '1px solid var(--color-border-light)' }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full rounded-md px-3 py-2 text-sm outline-none"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full rounded-md px-3 py-2 text-sm outline-none resize-none"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          Min Budget (₦)
                        </label>
                        <input
                          type="number"
                          value={editForm.budget_min}
                          onChange={(e) => setEditForm({ ...editForm, budget_min: e.target.value })}
                          className="w-full rounded-md px-3 py-2 text-sm outline-none"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          Max Budget (₦)
                        </label>
                        <input
                          type="number"
                          value={editForm.budget_max}
                          onChange={(e) => setEditForm({ ...editForm, budget_max: e.target.value })}
                          className="w-full rounded-md px-3 py-2 text-sm outline-none"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          Urgency
                        </label>
                        <select
                          value={editForm.urgency}
                          onChange={(e) =>
                            setEditForm({ ...editForm, urgency: e.target.value as JobRequest['urgency'] })
                          }
                          className="w-full rounded-md px-3 py-2 text-sm outline-none"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          Address
                        </label>
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full rounded-md px-3 py-2 text-sm outline-none"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={savingJobId === job.id}
                        onClick={() => setEditingJobId(null)}
                        className="inline-flex items-center gap-1 rounded-md px-3.5 py-2 text-xs font-medium"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingJobId === job.id}
                        className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
                      >
                        {savingJobId === job.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {savingJobId === job.id ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {(job.budget_min != null || job.budget_max != null) && (
                        <span className="inline-flex items-center gap-1 font-medium" style={{ color: 'var(--color-text)' }}>
                          <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
                          ₦{Number(job.budget_min ?? 0).toLocaleString()}
                          {job.budget_max != null ? ` – ₦${Number(job.budget_max).toLocaleString()}` : ''}
                        </span>
                      )}
                      {job.address && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.address}
                        </span>
                      )}
                      {job.created_at && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {isExpanded && (
                  <div className="pt-4 space-y-3" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                    <h4 className="text-sm font-semibold">Submitted Bids</h4>
                    {loadingBidsJobId === job.id ? (
                      <div className="py-4 text-center">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" style={{ color: 'var(--color-primary)' }} />
                      </div>
                    ) : bidsForJob.length === 0 ? (
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        No bids placed on this job yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {bidsForJob.map((bid) => (
                          <div
                            key={bid.id}
                            className="rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold">
                                  {bid.artisan_profiles?.profiles?.full_name ?? 'Artisan'}
                                </span>
                                <VerificationBadge
                                  verified={Boolean(
                                    bid.artisan_profiles?.profiles?.is_verified ||
                                      bid.artisan_profiles?.verified_at
                                  )}
                                />
                                <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                                  ₦{Number(bid.amount ?? 0).toLocaleString()}
                                </span>
                                {bid.estimated_hours != null && (
                                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                    · {Number(bid.estimated_hours)} hrs
                                  </span>
                                )}
                                <span className="text-xs capitalize" style={{ color: 'var(--color-text-secondary)' }}>
                                  · {bid.status}
                                </span>
                              </div>
                              {bid.message && (
                                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                  {bid.message}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={messagingBidId === bid.id}
                                onClick={() => handleMessageBidder(job.id, bid)}
                                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-all disabled:opacity-60"
                                style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                              >
                                {messagingBidId === bid.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <MessageSquare className="h-3.5 w-3.5" />
                                )}
                                Message
                              </button>
                              {bid.status === 'pending' && (
                                <button
                                  type="button"
                                  disabled={acceptingBidId === bid.id}
                                  onClick={() => handleAcceptBid(job.id, bid.id)}
                                  className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
                                >
                                  {acceptingBidId === bid.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  )}
                                  Accept Bid
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
