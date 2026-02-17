const supabase = require('../config/supabase');

// Mock data for when Supabase is unavailable
const MOCK_STUDENTS = [
  { student_id: '0231bca001', roll_number: 'CS001', student_name: 'Aarav Goyal', email: 'aarav@example.com', phone_number: '9876543210', admission_year: 2023, batch: 'A', is_active: true },
  { student_id: '0231bca002', roll_number: 'CS002', student_name: 'Priya Sharma', email: 'priya@example.com', phone_number: '9876543211', admission_year: 2023, batch: 'B', is_active: true },
  { student_id: '0241cs001', roll_number: 'CS003', student_name: 'Rajesh Kumar', email: 'rajesh@example.com', phone_number: '9876543212', admission_year: 2024, batch: 'A', is_active: true },
];

// Helper function to extract course code from course_name (e.g., "BCA Computer Science" -> "BCA")
const extractCourseCode = (courseName) => {
  if (!courseName) return '';
  const parts = courseName.split(' ');
  return parts[0].toLowerCase(); // Get first word and lowercase
};

// Helper function to generate student_id: 0[YY]1[CourseCode][RollNumber]
// Example: 0251bca116 (year=25, course=bca, roll=116)
const generateStudentId = (yearOfJoining, courseCode, rollNumber) => {
  const yy = String(yearOfJoining).slice(-2); // Last 2 digits of year
  const code = courseCode.toLowerCase();
  return `0${yy}1${code}${rollNumber}`;
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

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_STUDENTS);
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('students').select('*').eq('student_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create student
const createStudent = async (req, res) => {
  try {
    const { roll_number, student_name, email, phone_number, admission_year, batch, class_id, custom_student_id } = req.body;
    
    // Validation
    if (!roll_number || !roll_number.trim()) {
      return res.status(422).json({ error: 'Roll number is required.' });
    }
    if (!student_name || !student_name.trim()) {
      return res.status(422).json({ error: 'Student name is required.' });
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
    if (!admission_year) {
      return res.status(422).json({ error: 'Admission year is required.' });
    }
    if (!batch || !batch.trim()) {
      return res.status(422).json({ error: 'Batch is required.' });
    }
    if (!class_id) {
      return res.status(422).json({ error: 'class_id is required for student enrollment.' });
    }
    
    // Generate or use custom student_id
    let student_id = custom_student_id;
    if (!student_id || !student_id.trim()) {
      // Auto-generate: 0[YY]1[CourseCode][RollNumber]
      // First, fetch class to get course_name
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('course_name')
        .eq('class_id', class_id)
        .single();
      if (classError || !classData) {
        return res.status(400).json({ error: 'Invalid class_id provided.' });
      }
      
      const courseCode = extractCourseCode(classData.course_name);
      if (!courseCode) {
        return res.status(400).json({ error: 'Unable to extract course code from class. Please provide a custom student_id.' });
      }
      
      student_id = generateStudentId(admission_year, courseCode, roll_number);
    } else {
      student_id = student_id.trim().toUpperCase();
    }
    
    const { data, error } = await supabase.from('students').insert([
      {
        student_id,
        roll_number: roll_number.trim().toUpperCase(),
        student_name: student_name.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phone_number.toString(),
        admission_year: parseInt(admission_year),
        batch: batch.trim(),
        class_id,
        is_active: true
      }
    ]).select();
    if (error) {
      // Improve error message for duplicate student_id
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        return res.status(409).json({ error: 'Student ID already exists. Please provide a different custom student_id.' });
      }
      throw error;
    }
    await updateClassStudentCount(class_id);
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data: existing, error: existingError } = await supabase
      .from('students')
      .select('class_id')
      .eq('student_id', id)
      .single();
    if (existingError) throw existingError;

    const { data, error } = await supabase.from('students').update(updates).eq('student_id', id).select();
    if (error) throw error;
    if (updates.class_id && updates.class_id !== existing.class_id) {
      await updateClassStudentCount(existing.class_id);
      await updateClassStudentCount(updates.class_id);
    } else if (existing.class_id) {
      await updateClassStudentCount(existing.class_id);
    }
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: existingError } = await supabase
      .from('students')
      .select('class_id')
      .eq('student_id', id)
      .single();
    if (existingError) throw existingError;
    const { error } = await supabase.from('students').delete().eq('student_id', id);
    if (error) throw error;
    if (existing.class_id) {
      await updateClassStudentCount(existing.class_id);
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
