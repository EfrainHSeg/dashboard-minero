import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'admin' | 'trabajador' | null;

interface UseUserRoleReturn {
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  isTrabajador: boolean;
}

export function useUserRole(userId?: string): UseUserRoleReturn {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    async function fetchRole() {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching role:', error);
          setRole(null);
        } else {
          setRole(data?.role || null);
        }
      } catch (err) {
        console.error('Error:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [userId]);

  return {
    role,
    loading,
    isAdmin: role === 'admin',
    isTrabajador: role === 'trabajador',
  };
}