const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_ROOMS = [
  { room_id: 1, room_number: '101', capacity: 50, has_projector: true, has_ac: true, computer_count: 30, is_active: true },
  { room_id: 2, room_number: '102', capacity: 60, has_projector: true, has_ac: true, computer_count: 40, is_active: true },
  { room_id: 3, room_number: '103', capacity: 40, has_projector: false, has_ac: true, computer_count: 0, is_active: true },
];

const getAllRooms = async (req, res) => {
  try {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_ROOMS);
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('rooms').select('*').eq('room_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { room_number, room_type, block_name, floor_number, capacity, has_projector, has_ac, computer_count } = req.body;
    const { data, error } = await supabase.from('rooms').insert([
      {
        room_number,
        room_type,
        block_name,
        floor_number,
        capacity,
        has_projector: has_projector || false,
        has_ac: has_ac || false,
        computer_count: computer_count || 0,
        availability_status: 'Free',
        is_active: true
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('rooms').update(updates).eq('room_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('rooms').delete().eq('room_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
