const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_CLASSES = [
  { class_id: 1, course_name: 'BCA', semester: 1, section: 'A', academic_year: '2024-2025', shift: 'Morning', student_count: 60, is_active: true },
  { class_id: 2, course_name: 'BCA', semester: 2, section: 'A', academic_year: '2024-2025', shift: 'Morning', student_count: 58, is_active: true },
  { class_id: 3, course_name: 'BCA', semester: 3, section: 'B', academic_year: '2024-2025', shift: 'Evening', student_count: 55, is_active: true },
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
    
    // Validation
    if (!course_name || !course_name.trim()) {
      return res.status(422).json({ error:  'Course name is required.' });
    }
    if (!semester || semester < 1 || semester > 8) {
      return res.status(422).json({ error: 'Semester must be between 1 and 8.' });
    }
    if (!section || !section.trim() || section.length !== 1) {
      return res.status(422).json({ error: 'Section must be a single letter.' });
    }
    if (!academic_year || !academic_year.trim()) {
      return res.status(422).json({ error: 'Academic year is required.' });
    }
    if (!['Morning', 'Evening'].includes(shift)) {
      return res.status(422).json({ error: 'Shift must be Morning or Evening.' });
    }
    
    const { data, error } = await supabase.from('classes').insert([
      {
        course_name: course_name.trim(),
        semester: parseInt(semester),
        section: section.trim().toUpperCase(),
        academic_year: academic_year.trim(),
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
