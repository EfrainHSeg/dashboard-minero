// src/services/authService.ts
import { supabase } from '../lib/supabaseClient';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type AuthErrorCode =
  | 'EMAIL_NOT_CONFIRMED'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_EXISTS'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: AuthErrorCode;
}

function norm(s?: string) {
  return (s || '').toLowerCase().trim();
}

function cleanEmail(email: string) {
  return email.trim();
}

export const authService = {
  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const email = cleanEmail(data.email);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password: data.password,
      });

      if (error) {
        const msg = norm(error.message);
        if (msg.includes('email not confirmed')) {
          return { success: false, message: 'Debes confirmar tu correo antes de iniciar sesión.', error: 'EMAIL_NOT_CONFIRMED' };
        }
        if (msg.includes('invalid login credentials')) {
          return { success: false, message: 'Credenciales incorrectas. Verifica tu email y contraseña.', error: 'INVALID_CREDENTIALS' };
        }
        return { success: false, message: error.message, error: 'UNKNOWN_ERROR' };
      }

      if (authData.user) {
        return { success: true, message: '¡Bienvenido de vuelta!' };
      }
      return { success: false, message: 'No se pudo iniciar sesión. Intenta nuevamente.', error: 'UNKNOWN_ERROR' };
    } catch {
      return { success: false, message: 'Error de conexión. Intenta nuevamente.', error: 'NETWORK_ERROR' };
    }
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const email = cleanEmail(data.email);
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          // Asegúrate de tener en Supabase → Auth → URL Configuration:
          // Site URL = http://localhost:5173 y Redirect URLs con http://localhost:5173/*
          emailRedirectTo: window.location.origin,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            full_name: `${data.firstName} ${data.lastName}`.trim(),
          },
        },
      });

      if (error) {
        const msg = norm(error.message);
        if (msg.includes('already registered')) {
          return { success: false, message: 'Este correo ya está registrado. Intenta iniciar sesión.', error: 'EMAIL_EXISTS' };
        }
        return { success: false, message: error.message, error: 'UNKNOWN_ERROR' };
      }

      if (authData.user) {
        return { success: true, message: '¡Cuenta creada! Revisa tu correo para confirmar.' };
      }
      return { success: false, message: 'Error al crear la cuenta.', error: 'UNKNOWN_ERROR' };
    } catch {
      return { success: false, message: 'Error de conexión. Intenta nuevamente.', error: 'NETWORK_ERROR' };
    }
  },

  // Reenviar confirmación (para “Email not confirmed”)
  async resendConfirmation(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: cleanEmail(email) });
      if (error) return { success: false, message: error.message, error: 'UNKNOWN_ERROR' };
      return { success: true, message: 'Te reenviamos el correo de confirmación. Revisa tu bandeja.' };
    } catch {
      return { success: false, message: 'Error de conexión. Intenta nuevamente.', error: 'NETWORK_ERROR' };
    }
  },

  // Reset password (envío de correo)
  async sendReset(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail(email), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { success: false, message: error.message, error: 'UNKNOWN_ERROR' };
      return { success: true, message: 'Te enviamos un correo para restablecer tu contraseña.' };
    } catch {
      return { success: false, message: 'Error de conexión. Intenta nuevamente.', error: 'NETWORK_ERROR' };
    }
  },

  // Logout
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  // Usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user ?? null;
  },

  // Sesión actual (útil si necesitas tokens)
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session ?? null;
  },

  // Escuchar cambios de auth
  onAuthChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },
};
