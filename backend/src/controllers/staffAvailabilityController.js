const supabase = require('../config/supabase');

const validateAvailability = (payload) => {
  const { staff_id, timeslot_id, is_recurring, day_of_week, date } = payload;
  if (!staff_id || !timeslot_id) {
    return 'staff_id and timeslot_id are required.';
  }

  if (is_recurring === true) {
    if (!day_of_week) {
      return 'day_of_week is required for recurring availability.';
    }
  } else if (is_recurring === false) {
    if (!date) {
      return 'date is required for date-specific availability.';
    }
  } else {
    return 'is_recurring must be true or false.';
  }

  return null;
};

const getAllStaffAvailability = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('staff_availability')
      .select('*, staff:staff_id(staff_name), timeslots:timeslot_id(day_of_week,start_time,end_time,shift)');
    if (error) throw error;
    const mapped = (data || []).map((row) => ({
      ...row,
      staff_name: row.staff?.staff_name,
      timeslot: row.timeslots || null
    }));
    res.status(200).json(mapped);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStaffAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('staff_availability')
      .select('*, staff:staff_id(staff_name), timeslots:timeslot_id(day_of_week,start_time,end_time,shift)')
      .eq('availability_id', id);
    if (error) throw error;
    const row = data[0];
    if (!row) {
      return res.status(200).json({});
    }
    res.status(200).json({
      ...row,
      staff_name: row.staff?.staff_name,
      timeslot: row.timeslots || null
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createStaffAvailability = async (req, res) => {
  try {
    const payload = {
      staff_id: req.body.staff_id,
      timeslot_id: req.body.timeslot_id,
      is_recurring: req.body.is_recurring,
      day_of_week: req.body.day_of_week,
      date: req.body.date,
      reason: req.body.reason,
      is_active: req.body.is_active !== undefined ? req.body.is_active : true
    };

    const validationError = validateAvailability(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { data, error } = await supabase.from('staff_availability').insert([payload]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStaffAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: existing, error: existingError } = await supabase
      .from('staff_availability')
      .select('*')
      .eq('availability_id', id)
      .single();
    if (existingError) throw existingError;

    const merged = {
      staff_id: updates.staff_id ?? existing.staff_id,
      timeslot_id: updates.timeslot_id ?? existing.timeslot_id,
      is_recurring: updates.is_recurring ?? existing.is_recurring,
      day_of_week: updates.day_of_week ?? existing.day_of_week,
      date: updates.date ?? existing.date
    };

    const validationError = validateAvailability(merged);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { data, error } = await supabase
      .from('staff_availability')
      .update(updates)
      .eq('availability_id', id)
      .select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStaffAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('staff_availability').delete().eq('availability_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Staff availability deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStaffAvailability,
  getStaffAvailabilityById,
  createStaffAvailability,
  updateStaffAvailability,
  deleteStaffAvailability
};
