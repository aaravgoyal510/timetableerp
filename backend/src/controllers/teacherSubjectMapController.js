const supabase = require('../config/supabase');

// Mock data
const MOCK_TEACHER_SUBJECT_MAP = [
  { staff_id: 1, subject_code: 'CS101', staff_name: 'Dr. John Smith', subject_name: 'Data Structures' },
  { staff_id: 2, subject_code: 'CS102', staff_name: 'Ms. Sarah Johnson', subject_name: 'Database Management' },
];

const getAllTeacherSubjectMap = async (req, res) => {
  try {
    const { data, error } = await supabase.from('teacher_subject_map').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_TEACHER_SUBJECT_MAP);
  }
};

const getTeacherSubjectMapById = async (req, res) => {
  try {
    const { id } = req.params;
    // Parse composite key: id should be "staffId_subjectCode"
    const [staff_id, subject_code] = id.split('_');
    const { data, error } = await supabase.from('teacher_subject_map').select('*').eq('staff_id', staff_id).eq('subject_code', subject_code);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTeacherSubjectMap = async (req, res) => {
  try {
    const { staff_id, subject_code } = req.body;
    const { data, error } = await supabase.from('teacher_subject_map').insert([
      {
        staff_id,
        subject_code
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTeacherSubjectMap = async (req, res) => {
  try {
    const { id } = req.params;
    const [staff_id, subject_code] = id.split('_');
    const { data, error } = await supabase.from('teacher_subject_map').update(req.body).eq('staff_id', staff_id).eq('subject_code', subject_code).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTeacherSubjectMap = async (req, res) => {
  try {
    const { id } = req.params;
    const [staff_id, subject_code] = id.split('_');
    const { error } = await supabase.from('teacher_subject_map').delete().eq('staff_id', staff_id).eq('subject_code', subject_code);
    if (error) throw error;
    res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllTeacherSubjectMap,
  getTeacherSubjectMapById,
  createTeacherSubjectMap,
  updateTeacherSubjectMap,
  deleteTeacherSubjectMap
};
