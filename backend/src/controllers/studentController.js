const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_STUDENTS = [
  { student_id: 1, roll_number: 'CS001', student_name: 'Aarav Goyal', email: 'aarav@example.com', phone_number: '9876543210', admission_year: 2023, batch: 'A', is_active: true },
  { student_id: 2, roll_number: 'CS002', student_name: 'Priya Sharma', email: 'priya@example.com', phone_number: '9876543211', admission_year: 2023, batch: 'B', is_active: true },
  { student_id: 3, roll_number: 'CS003', student_name: 'Rajesh Kumar', email: 'rajesh@example.com', phone_number: '9876543212', admission_year: 2024, batch: 'A', is_active: true },
];

const updateClassStudentCount = async (classId) => {
  if (!classId) return;
  const { count, error: countError } = await supabase
    .from('students')
    .select('student_id', { count: 'exact', head: true })
    .eq('class_id', classId);
  if (countError) throw countError;

  const { error: updateError } = await supabase
    .from('classes')
    .update({ student_count: count })
    .eq('class_id', classId);
  if (updateError) throw updateError;
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_STUDENTS);
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('students').select('*').eq('student_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create student
const createStudent = async (req, res) => {
  try {
    const { roll_number, student_name, email, phone_number, admission_year, batch, class_id } = req.body;
    if (!class_id) {
      return res.status(422).json({ error: 'class_id is required for student enrollment.' });
    }
    const { data, error } = await supabase.from('students').insert([
      {
        roll_number,
        student_name,
        email,
        phone_number,
        admission_year,
        batch,
        class_id,
        is_active: true
      }
    ]).select();
    if (error) throw error;
    await updateClassStudentCount(class_id);
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data: existing, error: existingError } = await supabase
      .from('students')
      .select('class_id')
      .eq('student_id', id)
      .single();
    if (existingError) throw existingError;

    const { data, error } = await supabase.from('students').update(updates).eq('student_id', id).select();
    if (error) throw error;
    if (updates.class_id && updates.class_id !== existing.class_id) {
      await updateClassStudentCount(existing.class_id);
      await updateClassStudentCount(updates.class_id);
    } else if (existing.class_id) {
      await updateClassStudentCount(existing.class_id);
    }
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: existingError } = await supabase
      .from('students')
      .select('class_id')
      .eq('student_id', id)
      .single();
    if (existingError) throw existingError;
    const { error } = await supabase.from('students').delete().eq('student_id', id);
    if (error) throw error;
    if (existing.class_id) {
      await updateClassStudentCount(existing.class_id);
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
