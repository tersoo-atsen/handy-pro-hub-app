-- Payment records

CREATE TABLE public.payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id          UUID NOT NULL REFERENCES public.bookings(id),
  payer_id            UUID NOT NULL REFERENCES public.profiles(id),
  payee_id            UUID NOT NULL REFERENCES public.profiles(id),
  amount              NUMERIC(10, 2) NOT NULL,
  platform_fee        NUMERIC(10, 2) DEFAULT 0,
  net_amount          NUMERIC(10, 2) NOT NULL,
  status              public.payment_status DEFAULT 'pending',
  provider            TEXT DEFAULT 'stripe',
  provider_payment_id TEXT,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
