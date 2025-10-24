import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Cliente con ANON KEY para validar tokens de usuarios
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Cliente con SERVICE ROLE KEY para operaciones de admin
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Middleware para verificar que el usuario es admin
async function verifyAdmin(req, res, next) {
  console.log('=== VERIFY ADMIN ===');
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No Bearer token');
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token.substring(0, 20) + '...');
  
  try {
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    console.log('User from token:', user?.id, user?.email);
    console.log('Auth error:', error);
    
    if (error || !user) {
      console.log('❌ Invalid token');
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }

    const { data: roleData, error: roleError } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    console.log('Role data:', roleData);
    console.log('Role error:', roleError);

    if (roleError || roleData?.role !== 'admin') {
      console.log('❌ Not admin or role error');
      return res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    console.log('✅ Admin verified');
    req.user = user;
    next();
  } catch (error) {
    console.log('❌ Exception:', error);
    return res.status(500).json({ success: false, message: 'Error al verificar permisos' });
  }
}

// GET /api/users - Obtener todos los usuarios
router.get('/', verifyAdmin, async (req, res) => {
  try {
    console.log('Getting all users...');
    // Obtener usuarios de auth
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    // Obtener roles
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('*');

    if (rolesError) throw rolesError;

    // Combinar información
    const usersWithRoles = users.map(user => {
      const userRole = roles?.find(r => r.user_id === user.id);
      return {
        id: user.id,
        email: user.email,
        role: userRole?.role || 'trabajador',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      };
    });

    console.log('✅ Users retrieved:', usersWithRoles.length);

    res.json({
      success: true,
      users: usersWithRoles,
      message: 'Usuarios obtenidos correctamente'
    });
  } catch (error) {
    console.error('❌ Error getting users:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener usuarios'
    });
  }
});

// POST /api/users - Crear nuevo usuario
router.post('/', verifyAdmin, async (req, res) => {
  try {
    console.log('Creating new user...');
    const { email, password, role } = req.body;
    console.log('Data:', { email, role });

    // Validaciones
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password y rol son obligatorios'
      });
    }

    if (!['admin', 'trabajador'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "admin" o "trabajador"'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Crear usuario en auth
    const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;
    if (!userData.user) throw new Error('No se pudo crear el usuario');

    console.log('User created in auth:', userData.user.id);

    // Asignar rol
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: role
      });

    if (roleError) {
      console.error('Error assigning role, deleting user...');
      // Si falla al asignar rol, eliminar usuario creado
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      throw roleError;
    }

    console.log('✅ User created successfully with role:', role);

    res.status(201).json({
      success: true,
      message: `Usuario creado exitosamente como ${role}`,
      userId: userData.user.id
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear usuario'
    });
  }
});

// PUT /api/users/:userId/role - Actualizar rol de usuario
router.put('/:userId/role', verifyAdmin, async (req, res) => {
  try {
    console.log('Updating user role...');
    const { userId } = req.params;
    const { role } = req.body;
    console.log('User:', userId, 'New role:', role);

    if (!['admin', 'trabajador'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "admin" o "trabajador"'
      });
    }

    const { error } = await supabaseAdmin
      .from('user_roles')
      .update({ role })
      .eq('user_id', userId);

    if (error) throw error;

    console.log('✅ Role updated successfully');

    res.json({
      success: true,
      message: 'Rol actualizado correctamente'
    });
  } catch (error) {
    console.error('❌ Error updating role:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar rol'
    });
  }
});

// DELETE /api/users/:userId - Eliminar usuario
router.delete('/:userId', verifyAdmin, async (req, res) => {
  try {
    console.log('Deleting user...');
    const { userId } = req.params;
    console.log('User ID:', userId);

    // Eliminar usuario de auth (esto también eliminará el rol por CASCADE)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;

    console.log('✅ User deleted successfully');

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar usuario'
    });
  }
});

export default router;