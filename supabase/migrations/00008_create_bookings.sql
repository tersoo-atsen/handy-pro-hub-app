-- Bookings created when a bid is accepted

CREATE TABLE public.bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES public.job_requests(id),
  bid_id          UUID REFERENCES public.bids(id),
  customer_id     UUID NOT NULL REFERENCES public.profiles(id),
  artisan_id      UUID NOT NULL REFERENCES public.artisan_profiles(id),
  status          public.booking_status DEFAULT 'pending',
  agreed_amount   NUMERIC(10, 2) NOT NULL,
  scheduled_start TIMESTAMPTZ,
  scheduled_end   TIMESTAMPTZ,
  actual_start    TIMESTAMPTZ,
  actual_end      TIMESTAMPTZ,
  customer_notes  TEXT,
  artisan_notes   TEXT,
  cancellation_reason TEXT,
  cancelled_by    UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
