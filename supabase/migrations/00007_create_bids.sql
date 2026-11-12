-- Bids placed by artisans on job requests

CREATE TABLE public.bids (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES public.job_requests(id) ON DELETE CASCADE,
  artisan_id      UUID NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  amount          NUMERIC(10, 2) NOT NULL,
  message         TEXT,
  estimated_hours NUMERIC(5, 2),
  status          public.bid_status DEFAULT 'pending',
  expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 minutes'),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (job_id, artisan_id)
);
