import { useState } from 'react';
import { Mail, Lock, TrendingUp, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService'; 
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [remember, setRemember] = useState(false);

  const year = new Date().getFullYear();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await authService.login({ email, password });

    if (result.success) {
      setSuccess(result.message || 'Inicio de sesión exitoso.');
    } else {
      setError(result.message || 'No se pudo iniciar sesión.');
    }

    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Ingresa tu correo para enviarte el enlace de recuperación.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    const r = await authService.sendReset(email);
    r.success ? setSuccess(r.message) : setError(r.message);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      
      {/* Lado izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 opacity-10" /> 

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow">
              <TrendingUp className="text-blue-600" size={28} />
            </div>
            <span className="text-white text-2xl font-extrabold">
              Dashboard Minero
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Controla tu producción<br />en tiempo real
          </h1>
          <p className="text-blue-100/90 text-lg">
            Monitorea KPIs, optimiza procesos y toma decisiones basadas en datos con nuestra
            plataforma integral de gestión minera.
          </p>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-blue-100 text-sm">Eficiencia</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-blue-100 text-sm">Monitoreo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-blue-100 text-sm">Empresas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
            
            {/* Logo mobile */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>

            {/* Cabecera */}
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Bienvenido</h2>
              <p className="text-slate-500">Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              <Input
                type="email"
                label="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                icon={Mail}
                required
              />

              <Input
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                icon={Lock}
                required
              />
            

              {/* Alertas */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-start gap-2 ring-1 ring-red-100">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-start gap-2 ring-1 ring-green-100">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{success}</span>
                </div>
              )}

              <Button type="submit" loading={loading} fullWidth>
                Iniciar Sesión
              </Button>
            </form>

            {/* Nota para contactar al administrador */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-600 text-sm text-center">
                Si necesitas acceso al sistema, contacta con el administrador para obtener tus credenciales.
              </p>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            © {year} Dashboard Minero – Efrain H Segura. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}