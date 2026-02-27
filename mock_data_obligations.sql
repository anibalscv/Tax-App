-- ==========================================
-- TaxFlow - Supabase Mock Data Script
-- ==========================================

-- 1. Create mock users in auth.users
-- Note: Requires proper pgcrypto extension and schema permissions.
-- We use a DO block to avoid constraint errors if they already exist.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'prueba@taxflow.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, role, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'prueba@taxflow.com', crypt('Password123!', gen_salt('bf')), now(), '{"name": "Usuario de Prueba"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', now(), now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@taxflow.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, role, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'admin@taxflow.com', crypt('AdminPass456!', gen_salt('bf')), now(), '{"name": "Administrador Prueba"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', now(), now()
    );
  END IF;
END $$;

-- 2. Add obligations columns to public.clients table
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS pending_obligations_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_obligations_total NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS next_obligation_date DATE,
ADD COLUMN IF NOT EXISTS obligations_details JSONB DEFAULT '[]'::jsonb;

-- 3. Sync auth.users to public.clients
INSERT INTO public.clients (id, email, full_name, tax_id, is_authenticated, biometric_verified)
SELECT id, email, raw_user_meta_data->>'name', 'RFC-TEST-001', true, true
FROM auth.users
WHERE email IN ('prueba@taxflow.com', 'admin@taxflow.com')
ON CONFLICT (id) DO NOTHING;

-- 4. Update the test users with mock obligations
UPDATE public.clients
SET 
  pending_obligations_count = 2,
  pending_obligations_total = 4500.50,
  next_obligation_date = '2026-03-17',
  obligations_details = '[
    {"type": "IVA", "period": "Febrero 2026", "amount": 2500.00, "currency": "MXN", "due_date": "2026-03-17", "status": "pending"},
    {"type": "ISR", "period": "Febrero 2026", "amount": 2000.50, "currency": "MXN", "due_date": "2026-03-17", "status": "pending"}
  ]'::jsonb
WHERE email = 'prueba@taxflow.com';

UPDATE public.clients
SET 
  pending_obligations_count = 0,
  pending_obligations_total = 0,
  next_obligation_date = NULL,
  obligations_details = '[]'::jsonb
WHERE email = 'admin@taxflow.com';

-- 5. Verify the data
SELECT email, pending_obligations_count, pending_obligations_total, next_obligation_date, obligations_details
FROM public.clients 
WHERE email IN ('prueba@taxflow.com', 'admin@taxflow.com');
