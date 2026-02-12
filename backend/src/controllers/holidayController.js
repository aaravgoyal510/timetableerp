const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_HOLIDAYS = [
  { holiday_id: 1, holiday_name: 'Republic Day', holiday_date: '2024-01-26', description: 'National Holiday' },
  { holiday_id: 2, holiday_name: 'Independence Day', holiday_date: '2024-08-15', description: 'National Holiday' },
];

const getAllHolidays = async (req, res) => {
  try {
    const { data, error } = await supabase.from('holidays').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_HOLIDAYS);
  }
};

const getHolidayById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('holidays').select('*').eq('holiday_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createHoliday = async (req, res) => {
  try {
    const { holiday_date, holiday_name } = req.body;
    const { data, error } = await supabase.from('holidays').insert([
      {
        holiday_date,
        holiday_name
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('holidays').update(updates).eq('holiday_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('holidays').delete().eq('holiday_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Holiday deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday
};
