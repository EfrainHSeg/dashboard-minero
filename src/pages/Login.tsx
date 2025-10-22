import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, TrendingUp, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Iniciar sesión
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setMessage({
              type: 'error',
              text: 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.'
            });
          } else if (error.message.includes('Invalid login credentials')) {
            setMessage({
              type: 'error',
              text: 'Credenciales incorrectas. Verifica tu email y contraseña.'
            });
          } else {
            setMessage({ type: 'error', text: error.message });
          }
        } else if (data.user) {
          setMessage({ type: 'success', text: '¡Login exitoso! Redirigiendo...' });
          setTimeout(() => onLoginSuccess(), 1000);
        }
      } else {
        // Registrarse
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else if (data.user) {
          setMessage({
            type: 'success',
            text: '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.'
          });
          setEmail('');
          setPassword('');
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Minero</h1>
          <p className="text-gray-600 mt-2">Sistema de Producción y KPIs</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleAuth} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Mensajes */}
          {message && (
            <div className={`p-4 rounded-lg text-sm flex items-start gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </span>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Registrarse'
            )}
          </button>
        </form>

        {/* Toggle entre Login y Registro */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
            }}
            className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium transition"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        {/* Información adicional para registro */}
        {!isLogin && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Mail className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-xs text-blue-800">
                <strong>Importante:</strong> Después de registrarte, recibirás un correo de confirmación. 
                Debes hacer clic en el enlace para activar tu cuenta antes de poder iniciar sesión.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}