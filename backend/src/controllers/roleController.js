const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_ROLES = [
  { role_id: 1, role_name: 'Admin', description: 'System administrator with full access', is_active: true },
  { role_id: 2, role_name: 'Teacher', description: 'Faculty member who teaches classes', is_active: true },
  { role_id: 3, role_name: 'Student', description: 'Student enrolled in classes', is_active: true },
  { role_id: 4, role_name: 'HOD', description: 'Head of Department', is_active: true },
];

const getAllRoles = async (req, res) => {
  try {
    const { data, error } = await supabase.from('roles_master').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_ROLES);
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('roles_master').select('*').eq('role_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { role_name, role_description } = req.body;
    const { data, error } = await supabase.from('roles_master').insert([
      {
        role_name,
        role_description,
        is_active: true
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('roles_master').update(updates).eq('role_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('roles_master').delete().eq('role_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
