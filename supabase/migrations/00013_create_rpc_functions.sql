-- RPC functions for geo-queries and business logic

-- Find nearby artisans within a radius (km), filtered by category
CREATE OR REPLACE FUNCTION public.find_nearby_artisans(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 10,
  category_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
  artisan_id      UUID,
  user_id         UUID,
  full_name       TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  rating_avg      NUMERIC,
  rating_count    INTEGER,
  hourly_rate     NUMERIC,
  distance_km     DOUBLE PRECISION,
  skills          JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ap.id AS artisan_id,
    p.id AS user_id,
    p.full_name,
    p.avatar_url,
    ap.bio,
    ap.rating_avg,
    ap.rating_count,
    ap.hourly_rate,
    ROUND(
      (ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      ) / 1000)::NUMERIC, 2
    )::DOUBLE PRECISION AS distance_km,
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'skill_id', s.id, 'skill_name', s.name,
        'category', c.name, 'proficiency', ask.proficiency
      )), '[]'::jsonb)
      FROM public.artisan_skills ask
      JOIN public.skills s ON s.id = ask.skill_id
      JOIN public.categories c ON c.id = s.category_id
      WHERE ask.artisan_id = ap.id
    ) AS skills
  FROM public.artisan_profiles ap
  JOIN public.profiles p ON p.id = ap.user_id
  WHERE
    ap.is_available = TRUE
    AND p.is_active = TRUE
    AND p.location IS NOT NULL
    AND ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000
    )
    AND (
      category_slug IS NULL
      OR EXISTS (
        SELECT 1 FROM public.artisan_skills ask2
        JOIN public.skills s2 ON s2.id = ask2.skill_id
        JOIN public.categories c2 ON c2.id = s2.category_id
        WHERE ask2.artisan_id = ap.id AND c2.slug = category_slug
      )
    )
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;


-- Find nearby open jobs for artisans
CREATE OR REPLACE FUNCTION public.find_nearby_jobs(
  artisan_lat DOUBLE PRECISION,
  artisan_lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 15
)
RETURNS TABLE (
  job_id          UUID,
  title           TEXT,
  description     TEXT,
  status          public.job_status,
  urgency         public.urgency_level,
  budget_min      NUMERIC,
  budget_max      NUMERIC,
  address         TEXT,
  distance_km     DOUBLE PRECISION,
  bid_count       INTEGER,
  customer_name   TEXT,
  category_name   TEXT,
  created_at      TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    jr.id AS job_id,
    jr.title,
    jr.description,
    jr.status,
    jr.urgency,
    jr.budget_min,
    jr.budget_max,
    jr.address,
    ROUND(
      (ST_Distance(
        jr.location,
        ST_SetSRID(ST_MakePoint(artisan_lng, artisan_lat), 4326)::geography
      ) / 1000)::NUMERIC, 2
    )::DOUBLE PRECISION AS distance_km,
    jr.bid_count,
    p.full_name AS customer_name,
    c.name AS category_name,
    jr.created_at
  FROM public.job_requests jr
  JOIN public.profiles p ON p.id = jr.customer_id
  JOIN public.categories c ON c.id = jr.category_id
  WHERE
    jr.status IN ('open', 'bidding')
    AND (jr.expires_at IS NULL OR jr.expires_at > NOW())
    AND ST_DWithin(
      jr.location,
      ST_SetSRID(ST_MakePoint(artisan_lng, artisan_lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY
    CASE jr.urgency
      WHEN 'emergency' THEN 1
      WHEN 'urgent' THEN 2
      WHEN 'normal' THEN 3
      WHEN 'low' THEN 4
    END,
    distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;


-- Accept a bid and create a booking (transactional)
CREATE OR REPLACE FUNCTION public.accept_bid(
  p_bid_id UUID,
  p_customer_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_bid RECORD;
  v_booking_id UUID;
BEGIN
  -- Lock and fetch the bid
  SELECT b.*, jr.customer_id AS job_customer_id, jr.id AS real_job_id
  INTO v_bid
  FROM public.bids b
  JOIN public.job_requests jr ON jr.id = b.job_id
  WHERE b.id = p_bid_id
  FOR UPDATE;

  -- Validate
  IF v_bid IS NULL THEN
    RAISE EXCEPTION 'Bid not found';
  END IF;
  IF v_bid.job_customer_id != p_customer_id THEN
    RAISE EXCEPTION 'Only the job owner can accept bids';
  END IF;
  IF v_bid.status != 'pending' THEN
    RAISE EXCEPTION 'Bid is no longer pending';
  END IF;

  -- Accept this bid
  UPDATE public.bids SET status = 'accepted', updated_at = NOW()
  WHERE id = p_bid_id;

  -- Reject all other pending bids for this job
  UPDATE public.bids SET status = 'rejected', updated_at = NOW()
  WHERE job_id = v_bid.job_id AND id != p_bid_id AND status = 'pending';

  -- Update job status
  UPDATE public.job_requests SET status = 'assigned', updated_at = NOW()
  WHERE id = v_bid.real_job_id;

  -- Create the booking
  INSERT INTO public.bookings (job_id, bid_id, customer_id, artisan_id, agreed_amount, status)
  VALUES (v_bid.real_job_id, p_bid_id, p_customer_id, v_bid.artisan_id, v_bid.amount, 'confirmed')
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql;
