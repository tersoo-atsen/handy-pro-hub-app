-- User profiles (extends auth.users)

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          public.user_role NOT NULL DEFAULT 'customer',
  full_name     TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  avatar_url    TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  country       TEXT DEFAULT 'Nigeria',
  location      geography(POINT, 4326),
  geohash       TEXT,
  is_verified   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Extends auth.users with app-specific profile data';
COMMENT ON COLUMN public.profiles.location IS 'PostGIS geography point for geo-queries (lng, lat)';
COMMENT ON COLUMN public.profiles.geohash IS 'Geohash prefix for Realtime channel filtering';
