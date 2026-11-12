-- Job requests posted by customers

CREATE TABLE public.job_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id     UUID NOT NULL REFERENCES public.categories(id),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  status          public.job_status DEFAULT 'draft',
  urgency         public.urgency_level DEFAULT 'normal',
  budget_min      NUMERIC(10, 2),
  budget_max      NUMERIC(10, 2),
  location        geography(POINT, 4326) NOT NULL,
  address         TEXT NOT NULL,
  geohash         TEXT NOT NULL,
  search_radius_km INTEGER DEFAULT 10,
  scheduled_at    TIMESTAMPTZ,
  media_urls      TEXT[],
  bid_count       INTEGER DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
);

-- Junction: job <-> required skills
CREATE TABLE public.job_skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID NOT NULL REFERENCES public.job_requests(id) ON DELETE CASCADE,
  skill_id      UUID NOT NULL REFERENCES public.skills(id),
  UNIQUE (job_id, skill_id)
);
