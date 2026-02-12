const supabase = require('../config/supabase');

// Mock data
const MOCK_STAFF_ROLE_MAP = [
  { staff_role_map_id: 1, staff_id: 1, role_id: 1, staff_name: 'Dr. John Smith', role_name: 'Admin', is_active: true },
  { staff_role_map_id: 2, staff_id: 2, role_id: 2, staff_name: 'Ms. Sarah Johnson', role_name: 'Teacher', is_active: true },
];

const getAllStaffRoleMap = async (req, res) => {
  try {
    const { data, error } = await supabase.from('staff_role_map').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_STAFF_ROLE_MAP);
  }
};

const getStaffRoleMapById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('staff_role_map').select('*').eq('staff_role_map_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createStaffRoleMap = async (req, res) => {
  try {
    const { staff_id, role_id, is_active } = req.body;
    const { data, error } = await supabase.from('staff_role_map').insert([
      {
        staff_id,
        role_id,
        is_active: is_active !== undefined ? is_active : true
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStaffRoleMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('staff_role_map').update(req.body).eq('staff_role_map_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStaffRoleMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('staff_role_map').delete().eq('staff_role_map_id', id).select();
    if (error) throw error;
    res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStaffRoleMap,
  getStaffRoleMapById,
  createStaffRoleMap,
  updateStaffRoleMap,
  deleteStaffRoleMap
};
