-- Custom enum types for the Handy Pro platform

CREATE TYPE public.user_role AS ENUM ('customer', 'artisan', 'admin');

CREATE TYPE public.job_status AS ENUM (
  'draft', 'open', 'bidding', 'assigned',
  'in_progress', 'completed', 'cancelled', 'disputed', 'resolved'
);

CREATE TYPE public.bid_status AS ENUM (
  'pending', 'accepted', 'rejected', 'withdrawn', 'expired'
);

CREATE TYPE public.booking_status AS ENUM (
  'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending', 'processing', 'completed', 'failed', 'refunded'
);

CREATE TYPE public.urgency_level AS ENUM ('low', 'normal', 'urgent', 'emergency');

CREATE TYPE public.notification_type AS ENUM (
  'new_job_nearby', 'new_bid', 'bid_accepted', 'bid_rejected',
  'booking_confirmed', 'job_started', 'job_completed',
  'payment_received', 'new_message', 'new_review'
);
