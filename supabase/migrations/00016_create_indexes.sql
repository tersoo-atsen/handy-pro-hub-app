-- Performance indexes

-- Spatial indexes (critical for geo-queries)
CREATE INDEX idx_profiles_location
  ON public.profiles USING GIST (location);
CREATE INDEX idx_job_requests_location
  ON public.job_requests USING GIST (location);

-- Geohash indexes (for Realtime channel filtering)
CREATE INDEX idx_profiles_geohash
  ON public.profiles (geohash);
CREATE INDEX idx_job_requests_geohash
  ON public.job_requests (geohash);

-- Foreign key and filter indexes
CREATE INDEX idx_artisan_profiles_user_id
  ON public.artisan_profiles (user_id);
CREATE INDEX idx_artisan_skills_artisan_id
  ON public.artisan_skills (artisan_id);
CREATE INDEX idx_job_requests_customer_id
  ON public.job_requests (customer_id);
CREATE INDEX idx_job_requests_status
  ON public.job_requests (status);
CREATE INDEX idx_job_requests_category_id
  ON public.job_requests (category_id);
CREATE INDEX idx_bids_job_id
  ON public.bids (job_id);
CREATE INDEX idx_bids_artisan_id
  ON public.bids (artisan_id);
CREATE INDEX idx_bids_status
  ON public.bids (status);
CREATE INDEX idx_bookings_customer_id
  ON public.bookings (customer_id);
CREATE INDEX idx_bookings_artisan_id
  ON public.bookings (artisan_id);
CREATE INDEX idx_reviews_reviewee_id
  ON public.reviews (reviewee_id);
CREATE INDEX idx_notifications_user_id
  ON public.notifications (user_id, is_read);
CREATE INDEX idx_messages_conversation_id
  ON public.messages (conversation_id);

-- Full-text / trigram search
CREATE INDEX idx_categories_name_trgm
  ON public.categories USING GIN (name gin_trgm_ops);
CREATE INDEX idx_job_requests_title_trgm
  ON public.job_requests USING GIN (title gin_trgm_ops);
