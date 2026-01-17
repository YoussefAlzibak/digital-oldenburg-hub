-- Entferne die alte unsichere UPDATE Policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Erstelle eine sichere UPDATE Policy die is_admin Änderungen verhindert
CREATE POLICY "Users can update own profile except admin flag"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND (
    -- Wenn is_admin sich ändert, muss der Benutzer Admin sein
    is_admin = (SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid())
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Kommentar zur Dokumentation
COMMENT ON POLICY "Users can update own profile except admin flag" ON public.profiles IS 
'Benutzer können ihr Profil aktualisieren, aber is_admin kann nur von Admins geändert werden';