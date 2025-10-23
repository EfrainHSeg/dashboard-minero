import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Users as UsersIcon, AlertCircle, Loader } from 'lucide-react';
import { userManagementService, type UserWithRole } from '../services/userManagementService';
import UserList from './UserList';
import CreateUserModal from './CreateUserModal';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError('');
    const result = await userManagementService.getAllUsers();
    
    if (result.success && result.users) {
      setUsers(result.users);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  async function handleCreateUser(email: string, password: string, role: 'admin' | 'trabajador') {
    const result = await userManagementService.createUser(email, password, role);
    
    if (result.success) {
      setShowCreateModal(false);
      loadUsers(); // Recargar lista
    }
    
    return result;
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    const result = await userManagementService.deleteUser(userId);
    
    if (result.success) {
      loadUsers(); // Recargar lista
    } else {
      alert(result.message);
    }
  }

  async function handleUpdateRole(userId: string, newRole: 'admin' | 'trabajador') {
    const result = await userManagementService.updateUserRole(userId, newRole);
    
    if (result.success) {
      loadUsers(); // Recargar lista
    } else {
      alert(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <ArrowLeft size={18} />
                Volver al Dashboard
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 w-10 h-10 rounded-lg flex items-center justify-center">
                  <UsersIcon className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                  <p className="text-sm text-gray-600">Gestión de usuarios y permisos</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <UserPlus size={18} />
              Crear Usuario
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <UsersIcon className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Administradores</p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <UsersIcon className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Trabajadores</p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'trabajador').length}
                </p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <UsersIcon className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-start gap-2 mb-6">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Loading o Lista de Usuarios */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={40} />
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        ) : (
          <UserList
            users={users}
            onDeleteUser={handleDeleteUser}
            onUpdateRole={handleUpdateRole}
          />
        )}
      </main>

      {/* Modal de Crear Usuario */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreateUser={handleCreateUser}
        />
      )}
    </div>
  );
}