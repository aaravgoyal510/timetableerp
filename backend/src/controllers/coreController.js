const supabase = require('../config/supabase');

/**
 * STUDENTS CONTROLLER
 */
const getStudents = async (req, res) => {
  try {
    const { class_id, department_id } = req.query;
    
    let query = supabase
      .from('students')
      .select(`
        *,
        classes(class_name, class_code, semester),
        student_role_map(role_id, roles_master(role_name))
      `)
      .eq('is_active', true);

    if (class_id) query = query.eq('class_id', class_id);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes(class_name, class_code),
        student_role_map(role_id, roles_master(role_name))
      `)
      .eq('student_id', id)
      .single();
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { student_name, roll_number, email, class_id, date_of_birth, gender, phone_number } = req.body;
    
    const { data, error } = await supabase
      .from('students')
      .insert([{ student_name, roll_number, email, class_id, date_of_birth, gender, phone_number }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('students')
      .update(req.body)
      .eq('student_id', id)
      .select();
    
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * STAFF CONTROLLER
 */
const getStaff = async (req, res) => {
  try {
    const { department_id } = req.query;
    
    let query = supabase
      .from('staff')
      .select(`
        *,
        staff_dept_map(department_id, departments(name)),
        staff_role_map(role_id, roles_master(role_name))
      `);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        staff_dept_map(department_id, departments(name)),
        staff_role_map(role_id, roles_master(role_name))
      `)
      .eq('staff_id', id)
      .single();
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CLASSES CONTROLLER
 */
const getClasses = async (req, res) => {
  try {
    const { department_id } = req.query;
    
    let query = supabase
      .from('classes')
      .select(`
        *,
        departments(name),
        staff(staff_name)
      `);
    
    if (department_id) query = query.eq('department_id', department_id);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * SUBJECTS CONTROLLER
 */
const getSubjects = async (req, res) => {
  try {
    const { department_id, semester } = req.query;
    
    let query = supabase
      .from('subjects_master')
      .select(`
        *,
        departments(name)
      `);
    
    if (department_id) query = query.eq('department_id', department_id);
    if (semester) query = query.eq('semester', semester);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * TIMETABLE CONTROLLER
 */
const getTimetable = async (req, res) => {
  try {
    const { class_id, staff_id, day_of_week, academic_year } = req.query;
    
    let query = supabase
      .from('timetables')
      .select(`
        *,
        classes(class_name, class_code),
        subjects(subject_name),
        staff(staff_name),
        rooms(room_number),
        timeslots(start_time, end_time, slot_name)
      `)
      .eq('is_active', true);
    
    if (class_id) query = query.eq('class_id', class_id);
    if (staff_id) query = query.eq('staff_id', staff_id);
    if (day_of_week) query = query.eq('day_of_week', day_of_week);
    if (academic_year) query = query.eq('academic_year', academic_year);
    
    const { data, error } = await query.order('day_of_week').order('timeslot_id');
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTimetable = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('timetables')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ATTENDANCE CONTROLLER
 */
const markAttendance = async (req, res) => {
  try {
    const { student_id, class_id, subject_id, staff_id, attendance_date, status, remarks } = req.body;
    
    const { data, error } = await supabase
      .from('attendance')
      .upsert([{ student_id, class_id, subject_id, staff_id, attendance_date, status, remarks }], {
        onConflict: 'student_id,class_id,subject_id,attendance_date'
      })
      .select();
    
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { student_id, class_id, subject_id, attendance_date } = req.query;
    
    let query = supabase
      .from('attendance')
      .select(`
        *,
        students(student_name, roll_number),
        subjects(subject_name),
        staff(staff_name)
      `);
    
    if (student_id) query = query.eq('student_id', student_id);
    if (class_id) query = query.eq('class_id', class_id);
    if (subject_id) query = query.eq('subject_id', subject_id);
    if (attendance_date) query = query.eq('attendance_date', attendance_date);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { student_id, academic_year } = req.query;
    
    let query = supabase
      .from('attendance_reports')
      .select(`
        *,
        students(student_name, roll_number),
        subjects(subject_name),
        classes(class_name)
      `);
    
    if (student_id) query = query.eq('student_id', student_id);
    if (academic_year) query = query.eq('academic_year', academic_year);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ROOMS CONTROLLER
 */
const getRooms = async (req, res) => {
  try {
    const { room_type, is_available } = req.query;
    
    let query = supabase
      .from('rooms')
      .select('*');
    
    if (room_type) query = query.eq('room_type', room_type);
    if (is_available) query = query.eq('is_active', is_available === 'true');
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * HOLIDAYS CONTROLLER
 */
const getHolidays = async (req, res) => {
  try {
    const { academic_year } = req.query;
    
    let query = supabase
      .from('holidays')
      .select('*')
      .order('holiday_date');
    
    if (academic_year) query = query.eq('academic_year', academic_year);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createHoliday = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('holidays')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DEPARTMENTS CONTROLLER
 */
const getDepartments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        staff(staff_name)
      `);
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DASHBOARD STATS
 */
const getDashboardStats = async (req, res) => {
  try {
    const { staff_id, user_role } = req;
    
    // Fetch stats based on user role
    const [
      totalStudents,
      totalClasses,
      totalSubjects,
      totalStaff,
      totalDepartments,
      totalRooms
    ] = await Promise.all([
      supabase.from('students').select('student_id', { count: 'exact' }),
      supabase.from('classes').select('class_id', { count: 'exact' }),
      supabase.from('subjects').select('subject_id', { count: 'exact' }),
      supabase.from('staff').select('staff_id', { count: 'exact' }),
      supabase.from('departments').select('department_id', { count: 'exact' }),
      supabase.from('rooms').select('room_id', { count: 'exact' })
    ]);

    res.status(200).json({
      totalStudents: totalStudents.count || 0,
      totalClasses: totalClasses.count || 0,
      totalSubjects: totalSubjects.count || 0,
      totalStaff: totalStaff.count || 0,
      totalDepartments: totalDepartments.count || 0,
      totalRooms: totalRooms.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Students
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  
  // Staff
  getStaff,
  getStaffById,
  
  // Classes
  getClasses,
  createClass,
  
  // Subjects
  getSubjects,
  
  // Timetable
  getTimetable,
  createTimetable,
  
  // Attendance
  markAttendance,
  getAttendance,
  getAttendanceReport,
  
  // Rooms
  getRooms,
  
  // Holidays
  getHolidays,
  createHoliday,
  
  // Departments
  getDepartments,
  createDepartment,
  
  // Dashboard
  getDashboardStats
};
