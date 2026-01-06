import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminRoutes from "@/components/AdminRoutes";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        // SECURITY: Check admin role via user_roles table using RPC function
        const { data: isAdmin, error } = await supabase
          .rpc('is_admin', { user_id: session.user.id });

        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/auth');
          return;
        }

        if (!isAdmin) {
          console.warn('Unauthorized access attempt to admin panel');
          navigate('/auth');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Lade...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminRoutes />;
}