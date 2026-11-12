-- Messaging system

CREATE TABLE public.conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID REFERENCES public.job_requests(id),
  participant_1   UUID NOT NULL REFERENCES public.profiles(id),
  participant_2   UUID NOT NULL REFERENCES public.profiles(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (job_id, participant_1, participant_2)
);

CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.profiles(id),
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
