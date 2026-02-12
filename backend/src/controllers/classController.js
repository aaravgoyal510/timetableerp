const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_CLASSES = [
  { class_id: 1, class_name: 'B1', semester: 1, section: 'A', total_students: 60, is_active: true },
  { class_id: 2, class_name: 'B2', semester: 2, section: 'A', total_students: 58, is_active: true },
  { class_id: 3, class_name: 'B3', semester: 3, section: 'B', total_students: 55, is_active: true },
];

const getAllClasses = async (req, res) => {
  try {
    const { data, error } = await supabase.from('classes').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_CLASSES);
  }
};

const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('classes').select('*').eq('class_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { course_name, semester, section, academic_year, shift } = req.body;
    const { data, error } = await supabase.from('classes').insert([
      {
        course_name,
        semester,
        section,
        academic_year,
        shift,
        is_active: true
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('classes').update(updates).eq('class_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('classes').delete().eq('class_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
