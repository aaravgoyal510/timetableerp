const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_ROOM_ALLOTMENT = [
  { room_allotment_id: 1, class_id: 1, room_id: 1, timetable_id: 1, date: '2024-02-13' },
  { room_allotment_id: 2, class_id: 2, room_id: 2, timetable_id: 2, date: '2024-02-13' },
];

const getAllRoomAllotments = async (req, res) => {
  try {
    const { data, error } = await supabase.from('room_allotment').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_ROOM_ALLOTMENT);
  }
};

const getRoomAllotmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('room_allotment').select('*').eq('booking_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createRoomAllotment = async (req, res) => {
  try {
    const { room_id, class_id, staff_id, subject_code, timeslot_id, allotment_date } = req.body;
    const { data, error } = await supabase.from('room_allotment').insert([
      {
        room_id,
        class_id,
        staff_id,
        subject_code,
        timeslot_id,
        allotment_date
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRoomAllotment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('room_allotment').update(updates).eq('booking_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRoomAllotment = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('room_allotment').delete().eq('booking_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Room allotment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllRoomAllotments,
  getRoomAllotmentById,
  createRoomAllotment,
  updateRoomAllotment,
  deleteRoomAllotment
};
