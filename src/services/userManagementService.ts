// src/services/userManagementService.ts
import { supabase } from '../lib/supabaseClient';

export interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'trabajador';
  created_at: string;
  last_sign_in_at?: string;
}

export const userManagementService = {
  async getAllUsers(): Promise<{ success: boolean; users?: UserWithRole[]; message: string }> {
    try {
      const { data: roles, error: rolesError } = await supabase.from('user_roles').select('*');
      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] =
        roles?.map((roleData: any) => ({
          id: roleData.user_id,
          email: 'usuario@ejemplo.com', // TODO: completar con RPC para emails reales
          role: roleData.role,
          created_at: roleData.created_at,
          last_sign_in_at: undefined,
        })) || [];

      return { success: true, users: usersWithRoles, message: 'Usuarios obtenidos correctamente' };
    } catch (error: any) {
      console.error('Error getting users:', error);
      return { success: false, message: error.message || 'Error al obtener usuarios' };
    }
  },

  // ⚠️ Parámetros no usados -> prefijo _
  async createUser(
    _email: string,
    _password: string,
    _role: 'admin' | 'trabajador'
  ): Promise<{ success: boolean; message: string; userId?: string }> {
    return {
      success: false,
      message:
        'Por favor, crea usuarios desde el Dashboard de Supabase en Authentication > Users. Después podrás asignarles el rol aquí.',
    };
  },

  async updateUserRole(userId: string, newRole: 'admin' | 'trabajador'): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
      if (error) throw error;
      return { success: true, message: 'Rol actualizado correctamente' };
    } catch (error: any) {
      console.error('Error updating role:', error);
      return { success: false, message: error.message || 'Error al actualizar rol' };
    }
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (error) throw error;
      return {
        success: true,
        message: 'Rol eliminado. Elimina el usuario desde Supabase Dashboard > Authentication',
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { success: false, message: error.message || 'Error al eliminar usuario' };
    }
  },

  // ⚠️ Parámetros no usados -> prefijo _
  async updateUserPassword(_userId: string, _newPassword: string): Promise<{ success: boolean; message: string }> {
    return {
      success: false,
      message: 'Cambia la contraseña desde Supabase Dashboard > Authentication > Users',
    };
  },
};
