import { useState } from 'react';
import { Trash2, Edit2, Shield, User, Mail, Calendar } from 'lucide-react';
import type { UserWithRole } from '../services/userManagementService';

interface UserListProps {
  users: UserWithRole[];
  onDeleteUser: (userId: string) => void;
  onUpdateRole: (userId: string, newRole: 'admin' | 'trabajador') => void;
}

export default function UserList({ users, onDeleteUser, onUpdateRole }: UserListProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function handleRoleChange(userId: string, newRole: 'admin' | 'trabajador') {
    onUpdateRole(userId, newRole);
    setEditingUserId(null);
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Acceso
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  {/* Usuario */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'admin' 
                          ? 'bg-purple-100' 
                          : 'bg-blue-100'
                      }`}>
                        {user.role === 'admin' ? (
                          <Shield className={`${
                            user.role === 'admin' 
                              ? 'text-purple-600' 
                              : 'text-blue-600'
                          }`} size={20} />
                        ) : (
                          <User className="text-blue-600" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rol */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === user.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'trabajador')}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="admin">Administrador</option>
                          <option value="trabajador">Trabajador</option>
                        </select>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-xs text-gray-600 hover:text-gray-800"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Trabajador'}
                      </span>
                    )}
                  </td>

                  {/* Fecha de Creación */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDate(user.created_at)}
                    </div>
                  </td>

                  {/* Último Acceso */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.last_sign_in_at ? (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(user.last_sign_in_at)}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Nunca</span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUserId(user.id)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition"
                        title="Cambiar rol"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info adicional */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total: <span className="font-semibold">{users.length}</span> usuario(s) registrado(s)
        </p>
      </div>
    </div>
  );
}