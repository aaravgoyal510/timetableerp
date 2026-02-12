const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_SUBJECTS = [
  { subject_id: 1, subject_name: 'Data Structures', subject_code: 'CS101', credits: 4, is_lab: false, is_active: true },
  { subject_id: 2, subject_name: 'Database Management', subject_code: 'CS102', credits: 3, is_lab: true, is_active: true },
  { subject_id: 3, subject_name: 'Web Development', subject_code: 'CS103', credits: 3, is_lab: true, is_active: true },
];

const getAllSubjects = async (req, res) => {
  try {
    const { data, error } = await supabase.from('subjects_master').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_SUBJECTS);
  }
};

const getSubjectByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const { data, error } = await supabase.from('subjects_master').select('*').eq('subject_code', code);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { subject_code, subject_name, course_name, department_id, semester, credits, hours_per_week, is_lab, duration_years } = req.body;
    const { data, error } = await supabase.from('subjects_master').insert([
      {
        subject_code,
        subject_name,
        course_name,
        department_id,
        semester,
        credits,
        hours_per_week,
        is_lab: is_lab || false,
        duration_years,
        is_active: true
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { code } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('subjects_master').update(updates).eq('subject_code', code).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { code } = req.params;
    const { error } = await supabase.from('subjects_master').delete().eq('subject_code', code);
    if (error) throw error;
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectByCode,
  createSubject,
  updateSubject,
  deleteSubject
};
