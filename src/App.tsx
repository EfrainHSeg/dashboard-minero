import { useState, useEffect } from 'react';
import { authService } from './services/authService';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  // Si no hay usuario, mostrar login
  if (!user) {
    return <LoginPage />;
  }

  // Si hay usuario, mostrar dashboard
  return (
    <Dashboard 
      userName={user.user_metadata?.full_name || user.email || 'Usuario'}
      userId={user.id}
    />
  );
}

export default App;