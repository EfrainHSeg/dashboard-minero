import { useState, useEffect } from 'react';
import { authService } from './services/authService';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import EmailConfirmed from './pages/EmailConfirmed';


function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Verificar si venimos de una confirmación de email
    const hash = window.location.hash;
    if (hash && hash.includes('type=signup')) {
      setShowConfirmation(true);
      setLoading(false);
      return;
    }

    // Verificar sesión actual
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthChange((currentUser) => {
      setUser(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mostrar página de confirmación
  if (showConfirmation) {
    return <EmailConfirmed />;
  }

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando Dashboard Minero...</p>
        </div>
      </div>
    );
  }

  // Renderizar según estado
  if (!user) {
    return showRegister ? (
      <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <Dashboard userName={user.user_metadata?.full_name || user.email || 'Usuario'} />;
}

export default App;