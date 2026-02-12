const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_TIMETABLE = [
  { timetable_id: 1, class_id: 1, subject_id: 1, staff_id: 1, timeslot_id: 1, room_id: 101, day_of_week: 'Monday', is_active: true },
  { timetable_id: 2, class_id: 1, subject_id: 2, staff_id: 2, timeslot_id: 3, room_id: 102, day_of_week: 'Tuesday', is_active: true },
];

const getAllTimetables = async (req, res) => {
  try {
    const { data, error } = await supabase.from('timetable').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_TIMETABLE);
  }
};

const getTimetableById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('timetable').select('*').eq('timetable_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTimetableByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { data, error } = await supabase.from('timetable').select('*').eq('class_id', classId);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTimetable = async (req, res) => {
  try {
    const { class_id, subject_code, staff_id, room_id, timeslot_id, timetable_date, is_lab } = req.body;
    const { data, error } = await supabase.from('timetable').insert([
      {
        class_id,
        subject_code,
        staff_id,
        room_id,
        timeslot_id,
        timetable_date,
        is_lab: is_lab || false
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('timetable').update(updates).eq('timetable_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('timetable').delete().eq('timetable_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllTimetables,
  getTimetableById,
  getTimetableByClass,
  createTimetable,
  updateTimetable,
  deleteTimetable
};
