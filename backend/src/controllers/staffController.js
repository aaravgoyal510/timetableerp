const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_STAFF = [
  { staff_id: 1, staff_name: 'Dr. John Smith', designation: 'Professor', email: 'john@example.com', phone_number: '9999999991', staff_type: 'Permanent', is_active: true },
  { staff_id: 2, staff_name: 'Ms. Sarah Johnson', designation: 'Assistant Professor', email: 'sarah@example.com', phone_number: '9999999992', staff_type: 'Permanent', is_active: true },
  { staff_id: 3, staff_name: 'Mr. Rajesh Patel', designation: 'Lecturer', email: 'rajesh@example.com', phone_number: '9999999993', staff_type: 'Contract', is_active: true },
];

const getAllStaff = async (req, res) => {
  try {
    const { data, error } = await supabase.from('staff').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_STAFF);
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('staff').select('*').eq('staff_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const { staff_name, email, phone_number, department_id, designation, staff_type } = req.body;
    
    // Validation
    if (!staff_name || !staff_name.trim()) {
      return res.status(422).json({ error: 'Staff name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(422).json({ error: 'Email is required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(422).json({ error: 'Please provide a valid email address.' });
    }
    if (!phone_number || !phone_number.trim()) {
      return res.status(422).json({ error: 'Phone number is required.' });
    }
    if (!/^[0-9]{10}$/.test(phone_number.toString())) {
      return res.status(422).json({ error: 'Phone number must be 10 digits.' });
    }
    if (!designation || !designation.trim()) {
      return res.status(422).json({ error: 'Designation is required.' });
    }
    if (!['Permanent', 'Visiting', 'Contract'].includes(staff_type)) {
      return res.status(422).json({ error: 'Invalid staff type. Must be Permanent, Visiting, or Contract.' });
    }
    if (!department_id) {
      return res.status(422).json({ error: 'Department is required.' });
    }
    
    const { data, error } = await supabase.from('staff').insert([
      {
        staff_name: staff_name.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phone_number.toString(),
        department_id,
        designation: designation.trim(),
        staff_type,
        is_active: true
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('staff').update(updates).eq('staff_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('staff').delete().eq('staff_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
};
