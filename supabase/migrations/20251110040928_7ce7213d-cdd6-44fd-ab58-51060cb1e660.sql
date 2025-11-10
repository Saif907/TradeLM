-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('founder', 'admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Only founders can manage roles
CREATE POLICY "Founders can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'founder'));

-- Update existing tables to allow founder access

-- Chats: Founders can view all chats
CREATE POLICY "Founders can view all chats"
  ON public.chats FOR SELECT
  USING (public.has_role(auth.uid(), 'founder'));

-- Messages: Founders can view all messages
CREATE POLICY "Founders can view all messages"
  ON public.messages FOR SELECT
  USING (public.has_role(auth.uid(), 'founder'));

-- Trades: Founders can view all trades
CREATE POLICY "Founders can view all trades"
  ON public.trades FOR SELECT
  USING (public.has_role(auth.uid(), 'founder'));

-- Profiles: Founders can view all profiles
CREATE POLICY "Founders can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'founder'));