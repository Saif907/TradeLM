-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add privacy and consent fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS consent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS privacy_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS pseudonymous_id UUID DEFAULT gen_random_uuid() UNIQUE;

-- Remove PII fields from profiles (email, full_name, avatar_url are in auth.users, no need to duplicate)
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS full_name,
DROP COLUMN IF EXISTS avatar_url;

-- Create audit log table for compliance
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pseudonymous_id UUID NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Founders can view all audit logs
CREATE POLICY "Founders can view all audit logs"
ON public.audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'founder'::app_role));

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION public.create_audit_log(
  _pseudonymous_id UUID,
  _action TEXT,
  _table_name TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (pseudonymous_id, action, table_name)
  VALUES (_pseudonymous_id, _action, _table_name);
END;
$$;

-- Update handle_new_user trigger to set pseudonymous_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, pseudonymous_id, consent_given, privacy_version)
  VALUES (
    new.id,
    gen_random_uuid(),
    FALSE,
    1
  );
  RETURN new;
END;
$$;

-- Add index for faster pseudonymous lookups
CREATE INDEX IF NOT EXISTS idx_profiles_pseudonymous_id ON public.profiles(pseudonymous_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_pseudonymous_id ON public.audit_logs(pseudonymous_id);

-- Update timestamp precision: Function to round timestamps to day precision
CREATE OR REPLACE FUNCTION public.round_to_day(ts TIMESTAMP WITH TIME ZONE)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT DATE_TRUNC('day', ts);
$$;

-- Function to get anonymized user analytics (for founder dashboard)
CREATE OR REPLACE FUNCTION public.get_anonymized_user_analytics()
RETURNS TABLE (
  pseudonymous_id UUID,
  join_date DATE,
  chat_count BIGINT,
  trade_count BIGINT,
  message_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only founders can access this
  IF NOT has_role(auth.uid(), 'founder'::app_role) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    p.pseudonymous_id,
    p.created_at::DATE as join_date,
    COUNT(DISTINCT c.id) as chat_count,
    COUNT(DISTINCT t.id) as trade_count,
    COUNT(DISTINCT m.id) as message_count
  FROM public.profiles p
  LEFT JOIN public.chats c ON p.id = c.user_id
  LEFT JOIN public.trades t ON p.id = t.user_id
  LEFT JOIN public.messages m ON p.id = m.user_id
  GROUP BY p.pseudonymous_id, p.created_at::DATE;
END;
$$;