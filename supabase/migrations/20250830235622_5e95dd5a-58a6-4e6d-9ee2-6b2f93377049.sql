-- Fix infinite recursion in profiles RLS policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a corrected policy using the existing is_admin function
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));