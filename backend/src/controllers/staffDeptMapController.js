const supabase = require('../config/supabase');

const getAllStaffDeptMaps = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('staff_dept_map')
      .select('*, staff:staff_id(staff_name), departments:department_id(name)');
    if (error) throw error;
    const mapped = (data || []).map((row) => ({
      ...row,
      staff_name: row.staff?.staff_name,
      department_name: row.departments?.name
    }));
    res.status(200).json(mapped);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStaffDeptMapById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('staff_dept_map')
      .select('*, staff:staff_id(staff_name), departments:department_id(name)')
      .eq('staff_dept_map_id', id);
    if (error) throw error;
    const row = data[0];
    if (!row) {
      return res.status(200).json({});
    }
    res.status(200).json({
      ...row,
      staff_name: row.staff?.staff_name,
      department_name: row.departments?.name
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createStaffDeptMap = async (req, res) => {
  try {
    const { staff_id, department_id, is_active } = req.body;
    if (!staff_id || !department_id) {
      return res.status(400).json({ error: 'staff_id and department_id are required.' });
    }
    const { data, error } = await supabase
      .from('staff_dept_map')
      .insert([
        {
          staff_id,
          department_id,
          is_active: is_active !== undefined ? is_active : true
        }
      ])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStaffDeptMap = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('staff_dept_map')
      .update(updates)
      .eq('staff_dept_map_id', id)
      .select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStaffDeptMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('staff_dept_map').delete().eq('staff_dept_map_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Staff department mapping deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStaffDeptMaps,
  getStaffDeptMapById,
  createStaffDeptMap,
  updateStaffDeptMap,
  deleteStaffDeptMap
};
