import { supabase } from '../lib/supabaseClient';

export interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'trabajador';
  created_at: string;
  last_sign_in_at?: string;
}

export const userManagementService = {
  // Obtener todos los usuarios con sus roles (solo admins)
  async getAllUsers(): Promise<{ success: boolean; users?: UserWithRole[]; message: string }> {
    try {
      // Obtener todos los roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Para cada rol, obtener la info del usuario desde auth.users (usando una función RPC)
      // Por ahora, devolvemos solo los roles con emails simulados
      const usersWithRoles: UserWithRole[] = roles?.map(roleData => ({
        id: roleData.user_id,
        email: 'usuario@ejemplo.com', // Temporal - necesitamos una función de Supabase para esto
        role: roleData.role,
        created_at: roleData.created_at,
        last_sign_in_at: undefined,
      })) || [];

      return {
        success: true,
        users: usersWithRoles,
        message: 'Usuarios obtenidos correctamente'
      };
    } catch (error: any) {
      console.error('Error getting users:', error);
      return {
        success: false,
        message: error.message || 'Error al obtener usuarios'
      };
    }
  },

  // Crear nuevo usuario - REQUIERE SERVICE ROLE KEY (hacer desde Supabase Dashboard manualmente)
  async createUser(email: string, password: string, role: 'admin' | 'trabajador'): Promise<{ success: boolean; message: string; userId?: string }> {
    return {
      success: false,
      message: 'Por favor, crea usuarios desde el Dashboard de Supabase en Authentication > Users. Después podrás asignarles el rol aquí.'
    };
  },

  // Actualizar rol de usuario (solo admins)
  async updateUserRole(userId: string, newRole: 'admin' | 'trabajador'): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      return {
        success: true,
        message: 'Rol actualizado correctamente'
      };
    } catch (error: any) {
      console.error('Error updating role:', error);
      return {
        success: false,
        message: error.message || 'Error al actualizar rol'
      };
    }
  },

  // Eliminar usuario - REQUIERE SERVICE ROLE KEY
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Solo eliminamos el rol, el usuario debe eliminarse desde Supabase Dashboard
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return {
        success: true,
        message: 'Rol eliminado. Elimina el usuario desde Supabase Dashboard > Authentication'
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: error.message || 'Error al eliminar usuario'
      };
    }
  },

  // Cambiar contraseña - REQUIERE SERVICE ROLE KEY
  async updateUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return {
      success: false,
      message: 'Cambia la contraseña desde Supabase Dashboard > Authentication > Users'
    };
  }
};