import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function EmailConfirmed() {
  useEffect(() => {
    // Cerrar la ventana automáticamente después de 3 segundos
    const timer = setTimeout(() => {
      window.close();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="text-white" size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Cuenta Confirmada!
        </h1>
        
        <p className="text-gray-600 mb-6 text-lg">
          Tu correo electrónico ha sido verificado exitosamente.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            Esta ventana se cerrará automáticamente en 3 segundos...
          </p>
        </div>
        
        <p className="text-gray-500 text-sm">
          Vuelve a la ventana anterior para iniciar sesión
        </p>
        
        <button
          onClick={() => window.close()}
          className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Cerrar esta ventana
        </button>
      </div>
    </div>
  );
}