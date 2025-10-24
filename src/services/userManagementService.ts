import { supabase } from '../lib/supabaseClient';

export interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'trabajador';
  created_at: string;
  last_sign_in_at?: string;
}

// URL del backend - cambiar en producción
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper para obtener el token de autenticación
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export const userManagementService = {
  // Obtener todos los usuarios con sus roles (solo admins)
  async getAllUsers(): Promise<{ success: boolean; users?: UserWithRole[]; message: string }> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        return {
          success: false,
          message: 'No estás autenticado'
        };
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuarios');
      }

      return data;
    } catch (error: any) {
      console.error('Error getting users:', error);
      return {
        success: false,
        message: error.message || 'Error al obtener usuarios'
      };
    }
  },

  // Crear nuevo usuario (solo admins)
  async createUser(email: string, password: string, role: 'admin' | 'trabajador'): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        return {
          success: false,
          message: 'No estás autenticado'
        };
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear usuario');
      }

      return data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: error.message || 'Error al crear usuario'
      };
    }
  },

  // Actualizar rol de usuario (solo admins)
  async updateUserRole(userId: string, newRole: 'admin' | 'trabajador'): Promise<{ success: boolean; message: string }> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        return {
          success: false,
          message: 'No estás autenticado'
        };
      }

      const response = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar rol');
      }

      return data;
    } catch (error: any) {
      console.error('Error updating role:', error);
      return {
        success: false,
        message: error.message || 'Error al actualizar rol'
      };
    }
  },

  // Eliminar usuario (solo admins)
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        return {
          success: false,
          message: 'No estás autenticado'
        };
      }

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar usuario');
      }

      return data;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: error.message || 'Error al eliminar usuario'
      };
    }
  },

  // Cambiar contraseña de usuario (solo admins)
  async updateUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        return {
          success: false,
          message: 'No estás autenticado'
        };
      }

      const response = await fetch(`${API_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar contraseña');
      }

      return data;
    } catch (error: any) {
      console.error('Error updating password:', error);
      return {
        success: false,
        message: error.message || 'Error al actualizar contraseña'
      };
    }
  }
};