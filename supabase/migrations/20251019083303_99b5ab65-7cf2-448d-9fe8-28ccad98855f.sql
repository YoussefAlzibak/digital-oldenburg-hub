-- Fix infinite recursion in user_roles RLS policy
-- Drop the existing recursive policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate the policy using the has_role() security definer function
-- This prevents recursion because has_role() bypasses RLS
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role));