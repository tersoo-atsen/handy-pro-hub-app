-- Row Level Security policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read all profiles, update only their own
CREATE POLICY "Profiles: public read"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: self update"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles: self insert"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- JOB REQUESTS: Customers CRUD their own; artisans can read open jobs
CREATE POLICY "Jobs: customer full access"
  ON public.job_requests FOR ALL
  USING (auth.uid() = customer_id);
CREATE POLICY "Jobs: artisans read open"
  ON public.job_requests FOR SELECT
  USING (status IN ('open', 'bidding'));

-- BIDS: Artisans manage their own; customers read bids on their jobs
CREATE POLICY "Bids: artisan manage own"
  ON public.bids FOR ALL
  USING (artisan_id IN (
    SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY "Bids: customer read on own jobs"
  ON public.bids FOR SELECT
  USING (job_id IN (
    SELECT id FROM public.job_requests WHERE customer_id = auth.uid()
  ));

-- BOOKINGS: Participants can read their own bookings
CREATE POLICY "Bookings: participant access"
  ON public.bookings FOR SELECT
  USING (
    customer_id = auth.uid()
    OR artisan_id IN (
      SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
    )
  );

-- NOTIFICATIONS: Users see only their own
CREATE POLICY "Notifications: self only"
  ON public.notifications FOR ALL
  USING (user_id = auth.uid());

-- MESSAGES: Conversation participants only
CREATE POLICY "Messages: participant read"
  ON public.messages FOR SELECT
  USING (conversation_id IN (
    SELECT id FROM public.conversations
    WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
  ));
CREATE POLICY "Messages: participant insert"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND conversation_id IN (
    SELECT id FROM public.conversations
    WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
  ));

-- CATEGORIES & SKILLS: Public read
CREATE POLICY "Categories: public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Skills: public read" ON public.skills FOR SELECT USING (true);

-- REVIEWS: Public read, insert by reviewer only
CREATE POLICY "Reviews: public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews: self insert"
  ON public.reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- ARTISAN PROFILES: Public read, owner update
CREATE POLICY "Artisan profiles: public read"
  ON public.artisan_profiles FOR SELECT USING (true);
CREATE POLICY "Artisan profiles: self update"
  ON public.artisan_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Artisan profiles: self insert"
  ON public.artisan_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- ARTISAN SKILLS: Public read, artisan manage own
CREATE POLICY "Artisan skills: public read"
  ON public.artisan_skills FOR SELECT USING (true);
CREATE POLICY "Artisan skills: artisan manage"
  ON public.artisan_skills FOR ALL
  USING (artisan_id IN (
    SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
  ));

-- ARTISAN PORTFOLIO: Public read, artisan manage own
CREATE POLICY "Artisan portfolio: public read"
  ON public.artisan_portfolio FOR SELECT USING (true);
CREATE POLICY "Artisan portfolio: artisan manage"
  ON public.artisan_portfolio FOR ALL
  USING (artisan_id IN (
    SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
  ));

-- ARTISAN AVAILABILITY: Public read, artisan manage own
CREATE POLICY "Artisan availability: public read"
  ON public.artisan_availability FOR SELECT USING (true);
CREATE POLICY "Artisan availability: artisan manage"
  ON public.artisan_availability FOR ALL
  USING (artisan_id IN (
    SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
  ));

-- CONVERSATIONS: Participants only
CREATE POLICY "Conversations: participant access"
  ON public.conversations FOR ALL
  USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- PAYMENTS: Participants only
CREATE POLICY "Payments: participant read"
  ON public.payments FOR SELECT
  USING (payer_id = auth.uid() OR payee_id = auth.uid());
