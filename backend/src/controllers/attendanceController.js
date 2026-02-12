const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_ATTENDANCE = [
  { attendance_id: 1, student_id: 1, class_id: 1, date: '2024-02-13', status: 'Present' },
  { attendance_id: 2, student_id: 2, class_id: 1, date: '2024-02-13', status: 'Absent' },
];

const getAllAttendance = async (req, res) => {
  try {
    const { data, error } = await supabase.from('attendance').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_ATTENDANCE);
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('attendance').select('*').eq('attendance_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { data, error } = await supabase.from('attendance').select('*').eq('student_id', studentId);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createAttendance = async (req, res) => {
  try {
    const { student_id, class_id, subject_code, staff_id, timeslot_id, attendance_date, status } = req.body;
    const { data, error } = await supabase.from('attendance').insert([
      {
        student_id,
        class_id,
        subject_code,
        staff_id,
        timeslot_id,
        attendance_date,
        status
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('attendance').update(updates).eq('attendance_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('attendance').delete().eq('attendance_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllAttendance,
  getAttendanceById,
  getAttendanceByStudent,
  createAttendance,
  updateAttendance,
  deleteAttendance
};
