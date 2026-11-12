-- Artisan-specific profiles and related tables

CREATE TABLE public.artisan_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio               TEXT,
  years_experience  INTEGER DEFAULT 0,
  hourly_rate       NUMERIC(10, 2),
  rating_avg        NUMERIC(3, 2) DEFAULT 0.00,
  rating_count      INTEGER DEFAULT 0,
  total_jobs        INTEGER DEFAULT 0,
  is_available      BOOLEAN DEFAULT TRUE,
  service_radius_km INTEGER DEFAULT 10,
  verified_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table: artisan <-> skills (many-to-many)
CREATE TABLE public.artisan_skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id    UUID NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  skill_id      UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency   INTEGER DEFAULT 1 CHECK (proficiency BETWEEN 1 AND 5),
  UNIQUE (artisan_id, skill_id)
);

-- Portfolio / work samples
CREATE TABLE public.artisan_portfolio (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id    UUID NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Availability schedule (weekly recurring)
CREATE TABLE public.artisan_availability (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id    UUID NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  UNIQUE (artisan_id, day_of_week),
  CHECK (start_time < end_time)
);
