const supabase = require('../config/supabase');

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getDayOfWeek = (dateString) => {
  if (!dateString) return null;
  const parsed = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return DAY_NAMES[parsed.getUTCDay()];
};

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

const validateTimetable = async (payload, excludeId) => {
  const {
    class_id,
    subject_code,
    staff_id,
    room_id,
    timeslot_id,
    timetable_date,
    is_lab
  } = payload;

  if (!class_id || !subject_code || !staff_id || !room_id || !timeslot_id || !timetable_date) {
    return { status: 400, message: 'Missing required timetable fields.' };
  }

  const dayOfWeek = getDayOfWeek(timetable_date);
  if (!dayOfWeek) {
    return { status: 400, message: 'Invalid timetable_date. Expected YYYY-MM-DD.' };
  }

  const { data: subject, error: subjectError } = await supabase
    .from('subjects_master')
    .select('is_lab')
    .eq('subject_code', subject_code)
    .single();
  if (subjectError) return { status: 400, message: subjectError.message };

  if (subject.is_lab !== true && is_lab === true) {
    return { status: 422, message: 'Timetable is_lab cannot be true for a non-lab subject.' };
  }
  if (subject.is_lab === true && is_lab !== true) {
    return { status: 422, message: 'Lab subjects must have timetable is_lab set to true.' };
  }

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('capacity, room_type')
    .eq('room_id', room_id)
    .single();
  if (roomError) return { status: 400, message: roomError.message };

  if (room.capacity === null || room.capacity === undefined) {
    return { status: 422, message: 'Room capacity must be set before scheduling.' };
  }

  if (subject.is_lab === true) {
    const roomType = (room.room_type || '').toLowerCase();
    if (!roomType.includes('lab')) {
      return { status: 422, message: 'Lab subjects must be scheduled in a lab room.' };
    }
  }

  const { count: classSize, error: countError } = await supabase
    .from('students')
    .select('student_id', { count: 'exact', head: true })
    .eq('class_id', class_id);
  if (countError) return { status: 400, message: countError.message };

  if (room.capacity < (classSize || 0)) {
    return { status: 422, message: 'Room capacity is smaller than class size.' };
  }

  await updateClassStudentCount(class_id);

  let conflictQuery = supabase
    .from('timetable')
    .select('timetable_id')
    .eq('timetable_date', timetable_date)
    .eq('timeslot_id', timeslot_id)
    .or(`class_id.eq.${class_id},staff_id.eq.${staff_id},room_id.eq.${room_id}`);

  if (excludeId) {
    conflictQuery = conflictQuery.neq('timetable_id', excludeId);
  }

  const { data: conflicts, error: conflictError } = await conflictQuery;
  if (conflictError) return { status: 400, message: conflictError.message };
  if (conflicts && conflicts.length > 0) {
    return { status: 409, message: 'Timetable conflict: class, staff, or room is already booked.' };
  }

  const { data: recurringBlocks, error: recurringError } = await supabase
    .from('staff_availability')
    .select('availability_id')
    .eq('staff_id', staff_id)
    .eq('timeslot_id', timeslot_id)
    .eq('is_active', true)
    .eq('is_recurring', true)
    .eq('day_of_week', dayOfWeek);
  if (recurringError) return { status: 400, message: recurringError.message };
  if (recurringBlocks && recurringBlocks.length > 0) {
    return { status: 409, message: 'Staff is unavailable for this recurring timeslot.' };
  }

  const { data: dateBlocks, error: dateError } = await supabase
    .from('staff_availability')
    .select('availability_id')
    .eq('staff_id', staff_id)
    .eq('timeslot_id', timeslot_id)
    .eq('is_active', true)
    .eq('is_recurring', false)
    .eq('date', timetable_date);
  if (dateError) return { status: 400, message: dateError.message };
  if (dateBlocks && dateBlocks.length > 0) {
    return { status: 409, message: 'Staff is unavailable for this date.' };
  }

  return null;
};

// Mock data for when Supabase is unavailable
const MOCK_TIMETABLE = [
  { timetable_id: 1, class_id: 1, subject_code: 'CS101', staff_id: 1, timeslot_id: 1, room_id: 101, timetable_date: '2024-02-12', is_lab: false },
  { timetable_id: 2, class_id: 1, subject_code: 'CS102', staff_id: 2, timeslot_id: 3, room_id: 102, timetable_date: '2024-02-13', is_lab: true },
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
    const payload = {
      class_id: req.body.class_id,
      subject_code: req.body.subject_code,
      staff_id: req.body.staff_id,
      room_id: req.body.room_id,
      timeslot_id: req.body.timeslot_id,
      timetable_date: req.body.timetable_date,
      is_lab: req.body.is_lab || false
    };

    const validationError = await validateTimetable(payload);
    if (validationError) {
      return res.status(validationError.status).json({ error: validationError.message });
    }

    const { data, error } = await supabase.from('timetable').insert([payload]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: existingError } = await supabase
      .from('timetable')
      .select('*')
      .eq('timetable_id', id)
      .single();
    if (existingError) throw existingError;

    const payload = {
      class_id: req.body.class_id ?? existing.class_id,
      subject_code: req.body.subject_code ?? existing.subject_code,
      staff_id: req.body.staff_id ?? existing.staff_id,
      room_id: req.body.room_id ?? existing.room_id,
      timeslot_id: req.body.timeslot_id ?? existing.timeslot_id,
      timetable_date: req.body.timetable_date ?? existing.timetable_date,
      is_lab: req.body.is_lab ?? existing.is_lab
    };

    const validationError = await validateTimetable(payload, id);
    if (validationError) {
      return res.status(validationError.status).json({ error: validationError.message });
    }

    const { data, error } = await supabase
      .from('timetable')
      .update({ ...req.body })
      .eq('timetable_id', id)
      .select();
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
