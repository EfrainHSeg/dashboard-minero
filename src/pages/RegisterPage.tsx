import { useState } from 'react';
import { authService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, TrendingUp, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const result = await authService.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName
    });

    if (result.success) {
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-white" size={48} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Registro Exitoso!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Hemos enviado un correo de confirmación a tu email. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Importante:</strong> No olvides revisar tu carpeta de spam si no ves el correo.
            </p>
          </div>

          <Button onClick={onSwitchToLogin} fullWidth>
            Ir al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Lado izquierdo - Información */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-12 text-white flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-purple-600" size={28} />
                </div>
                <span className="text-2xl font-bold">Dashboard Minero</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Únete a nosotros</h2>
              <p className="text-purple-100 text-lg">
                Crea tu cuenta y comienza a optimizar tu producción minera hoy mismo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-300 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Análisis en tiempo real</h3>
                  <p className="text-purple-100 text-sm">Monitorea tus KPIs al instante</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-300 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Reportes automatizados</h3>
                  <p className="text-purple-100 text-sm">Genera informes con un clic</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-300 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Soporte 24/7</h3>
                  <p className="text-purple-100 text-sm">Estamos aquí para ayudarte</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado derecho - Formulario */}
          <div className="p-8 md:p-12">
            <button
              onClick={onSwitchToLogin}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver al login</span>
            </button>

            <h3 className="text-3xl font-bold text-gray-900 mb-2">Crear cuenta</h3>
            <p className="text-gray-600 mb-8">Completa el formulario para comenzar</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Nombre"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="Nombres"
                  icon={User}
                  required
                />
                <Input
                  type="text"
                  label="Apellido"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  placeholder="Apellidos"
                  icon={User}
                  required
                />
              </div>

              <Input
                type="email"
                label="Correo Electrónico"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="Correo electrónico"
                icon={Mail}
                required
              />

              <Input
                type="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Mínimo 6 caracteres"
                icon={Lock}
                required
                minLength={6}
              />

              <Input
                type="password"
                label="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Repite tu contraseña"
                icon={Lock}
                required
                minLength={6}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1 rounded border-gray-300" />
                <label className="text-xs text-gray-600">
                  Acepto los <button type="button" className="text-blue-600 hover:underline">términos y condiciones</button> y la <button type="button" className="text-blue-600 hover:underline">política de privacidad</button>
                </label>
              </div>

              <Button type="submit" loading={loading} fullWidth>
                Crear mi cuenta
              </Button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}