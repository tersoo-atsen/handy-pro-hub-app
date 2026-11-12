-- Auto-create profile trigger on new user signup & backfill existing users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
BEGIN
  -- Extract role or default to customer
  v_role := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'role', '')::public.user_role,
    'customer'::public.user_role
  );

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'User'),
    NEW.raw_user_meta_data->>'phone',
    v_role
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    phone = COALESCE(profiles.phone, EXCLUDED.phone),
    updated_at = NOW();

  -- If artisan, ensure artisan_profiles row exists
  IF v_role = 'artisan' THEN
    INSERT INTO public.artisan_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger whenever a user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill any existing users in auth.users that don't have a profile yet
INSERT INTO public.profiles (id, email, full_name, phone, role)
SELECT
  id,
  COALESCE(email, ''),
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1), 'User'),
  raw_user_meta_data->>'phone',
  COALESCE(NULLIF(raw_user_meta_data->>'role', '')::public.user_role, 'customer'::public.user_role)
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Backfill artisan_profiles for existing artisans
INSERT INTO public.artisan_profiles (user_id)
SELECT id
FROM public.profiles
WHERE role = 'artisan'
ON CONFLICT (user_id) DO NOTHING;
