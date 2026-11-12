export enum UserRole {
  Customer = 'customer',
  Artisan = 'artisan',
  Admin = 'admin',
}

export enum JobStatus {
  Draft = 'draft',
  Open = 'open',
  Bidding = 'bidding',
  Assigned = 'assigned',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Disputed = 'disputed',
  Resolved = 'resolved',
}

export enum BidStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn',
  Expired = 'expired',
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum PaymentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
  Refunded = 'refunded',
}

export enum UrgencyLevel {
  Low = 'low',
  Normal = 'normal',
  Urgent = 'urgent',
  Emergency = 'emergency',
}

export enum NotificationType {
  NewJobNearby = 'new_job_nearby',
  NewBid = 'new_bid',
  BidAccepted = 'bid_accepted',
  BidRejected = 'bid_rejected',
  BookingConfirmed = 'booking_confirmed',
  JobStarted = 'job_started',
  JobCompleted = 'job_completed',
  PaymentReceived = 'payment_received',
  NewMessage = 'new_message',
  NewReview = 'new_review',
}
