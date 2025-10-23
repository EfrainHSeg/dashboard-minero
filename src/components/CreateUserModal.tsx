import { useState } from 'react';
import { X, Mail, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface CreateUserModalProps {
  onClose: () => void;
  onCreateUser: (email: string, password: string, role: 'admin' | 'trabajador') => Promise<{ success: boolean; message: string }>;
}

export default function CreateUserModal({ onClose, onCreateUser }: CreateUserModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'trabajador'>('trabajador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones
    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await onCreateUser(email, password, role);

    if (result.success) {
      setSuccess(result.message);
      // Limpiar formulario
      setEmail('');
      setPassword('');
      setRole('trabajador');
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* Título */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos para agregar un nuevo usuario al sistema
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="usuario@ejemplo.com"
                required
                disabled={loading}
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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              La contraseña debe tener al menos 6 caracteres
            </p>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol del Usuario
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'trabajador')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                disabled={loading}
              >
                <option value="trabajador">Trabajador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Trabajador:</span> Acceso al dashboard de producción
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Administrador:</span> Acceso completo + gestión de usuarios
              </p>
            </div>
          </div>

          {/* Mensajes de error o éxito */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-start gap-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-start gap-2">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </span>
              ) : (
                'Crear Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}