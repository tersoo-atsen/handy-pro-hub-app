-- Database triggers

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_artisan_profiles_updated_at
  BEFORE UPDATE ON public.artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_job_requests_updated_at
  BEFORE UPDATE ON public.job_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_bids_updated_at
  BEFORE UPDATE ON public.bids
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- Auto-increment bid_count on job_requests when a new bid is placed
CREATE OR REPLACE FUNCTION public.increment_bid_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.job_requests
  SET bid_count = bid_count + 1,
      status = CASE WHEN status = 'open' THEN 'bidding'::public.job_status ELSE status END
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bid_inserted
  AFTER INSERT ON public.bids
  FOR EACH ROW EXECUTE FUNCTION public.increment_bid_count();


-- Auto-update artisan rating when a review is inserted
CREATE OR REPLACE FUNCTION public.update_artisan_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_artisan_profile_id UUID;
BEGIN
  SELECT id INTO v_artisan_profile_id
  FROM public.artisan_profiles
  WHERE user_id = NEW.reviewee_id;

  IF v_artisan_profile_id IS NOT NULL THEN
    UPDATE public.artisan_profiles
    SET
      rating_avg = (
        SELECT ROUND(AVG(r.rating)::NUMERIC, 2)
        FROM public.reviews r
        WHERE r.reviewee_id = NEW.reviewee_id
      ),
      rating_count = (
        SELECT COUNT(*)
        FROM public.reviews r
        WHERE r.reviewee_id = NEW.reviewee_id
      )
    WHERE id = v_artisan_profile_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_inserted
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_artisan_rating();


-- Auto-generate geohash when location is set on profiles or job_requests
CREATE OR REPLACE FUNCTION public.generate_geohash()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location IS NOT NULL THEN
    NEW.geohash = ST_GeoHash(NEW.location::geometry, 6);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_geohash
  BEFORE INSERT OR UPDATE OF location ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_geohash();

CREATE TRIGGER trg_jobs_geohash
  BEFORE INSERT OR UPDATE OF location ON public.job_requests
  FOR EACH ROW EXECUTE FUNCTION public.generate_geohash();
