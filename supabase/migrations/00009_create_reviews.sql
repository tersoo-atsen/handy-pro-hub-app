-- Reviews for completed bookings

CREATE TABLE public.reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id     UUID NOT NULL REFERENCES public.profiles(id),
  reviewee_id     UUID NOT NULL REFERENCES public.profiles(id),
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (booking_id, reviewer_id)
);
