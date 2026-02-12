const supabase = require('../config/supabase');

// Mock data
const MOCK_STUDENT_ROLE_MAP = [
  { student_role_map_id: 1, student_id: 1, role_id: 3, student_name: 'Aarav Goyal', role_name: 'Student', is_active: true },
  { student_role_map_id: 2, student_id: 2, role_id: 3, student_name: 'Priya Sharma', role_name: 'Student', is_active: true },
];

const getAllStudentRoleMap = async (req, res) => {
  try {
    const { data, error } = await supabase.from('student_role_map').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_STUDENT_ROLE_MAP);
  }
};

const getStudentRoleMapById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('student_role_map').select('*').eq('student_role_map_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createStudentRoleMap = async (req, res) => {
  try {
    const { student_id, role_id, is_active } = req.body;
    const { data, error } = await supabase.from('student_role_map').insert([
      {
        student_id,
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

const updateStudentRoleMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('student_role_map').update(req.body).eq('student_role_map_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStudentRoleMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('student_role_map').delete().eq('student_role_map_id', id).select();
    if (error) throw error;
    res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStudentRoleMap,
  getStudentRoleMapById,
  createStudentRoleMap,
  updateStudentRoleMap,
  deleteStudentRoleMap
};
