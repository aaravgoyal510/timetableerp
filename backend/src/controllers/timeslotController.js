const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_TIMESLOTS = [
  { timeslot_id: 1, day_of_week: 'Monday', start_time: '09:00', end_time: '10:30', is_break: false },
  { timeslot_id: 2, day_of_week: 'Monday', start_time: '10:30', end_time: '10:45', is_break: true },
  { timeslot_id: 3, day_of_week: 'Monday', start_time: '10:45', end_time: '12:15', is_break: false },
];

const getAllTimeslots = async (req, res) => {
  try {
    const { data, error } = await supabase.from('timeslots').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_TIMESLOTS);
  }
};

const getTimeslotById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('timeslots').select('*').eq('timeslot_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTimeslot = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, slot_number, is_break, shift } = req.body;
    const { data, error } = await supabase.from('timeslots').insert([
      {
        day_of_week,
        start_time,
        end_time,
        slot_number,
        is_break: is_break || false,
        shift
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTimeslot = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('timeslots').update(updates).eq('timeslot_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTimeslot = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('timeslots').delete().eq('timeslot_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Timeslot deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllTimeslots,
  getTimeslotById,
  createTimeslot,
  updateTimeslot,
  deleteTimeslot
};
