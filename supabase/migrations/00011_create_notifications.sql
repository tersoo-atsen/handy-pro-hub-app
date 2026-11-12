-- In-app notifications

CREATE TABLE public.notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            public.notification_type NOT NULL,
  title           TEXT NOT NULL,
  body            TEXT,
  data            JSONB,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
