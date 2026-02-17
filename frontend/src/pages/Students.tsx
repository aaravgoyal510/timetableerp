import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { studentsAPI, classesAPI } from '../api';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface Student {
  student_id: string;
  roll_number: string;
  student_name: string;
  email: string;
  phone_number: string | number;
  admission_year: number;
  batch: string;
  class_id: number;
  is_active: boolean;
}

interface Class {
  class_id: number;
  course_name: string;
  semester: number;
  section: string;
  academic_year: string;
  shift: string;
}

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    roll_number: '',
    student_name: '',
    email: '',
    phone_number: '',
    admission_year: currentYear.toString(),
    batch: `${currentYear}-${currentYear + 4}`,
    class_id: '',
    custom_student_id: ''
  });

  // Helper to extract course code from course_name
  const extractCourseCode = (courseName: string) => {
    if (!courseName) return '';
    const parts = courseName.split(' ');
    return parts[0].toLowerCase();
  };

  // Helper to generate student_id: 0[YY]1[CourseCode][RollNumber]
  const generateStudentId = () => {
    if (!formData.class_id || !formData.admission_year || !formData.roll_number) return '';
    const cls = classes.find(c => c.class_id === parseInt(formData.class_id));
    if (!cls) return '';
    const courseCode = extractCourseCode(cls.course_name);
    const yy = formData.admission_year.slice(-2);
    return `0${yy}1${courseCode}${formData.roll_number}`.toLowerCase();
  };

  const previewStudentId = generateStudentId();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        studentsAPI.getAll(),
        classesAPI.getAll()
      ]);
      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate batch when admission year changes
  const handleAdmissionYearChange = (year: string) => {
    const yearNum = parseInt(year);
    setFormData({
      ...formData,
      admission_year: year,
      batch: `${yearNum}-${yearNum + 4}`
    });
  };

  // Auto-generate email from name
  const handleNameChange = (name: string) => {
    const email = name.toLowerCase().replace(/\s+/g, '.') + '@student.edu';
    setFormData({
      ...formData,
      student_name: name,
      email: formData.email || email // Only auto-fill if empty
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class_id) {
      setError('Please select a a class');
      return;
    }

    try {
      setSubmitting(true);
      const payload: Record<string, unknown> = {
        ...formData,
        class_id: parseInt(formData.class_id),
        admission_year: parseInt(formData.admission_year)
      };
      if (!formData.custom_student_id) {
        delete payload.custom_student_id;
      }
      await studentsAPI.create(payload);
      
      setSuccess('Student added successfully!');
      setFormData({
        roll_number: '',
        student_name: '',
        email: '',
        phone_number: '',
        admission_year: formData.admission_year,
        batch: formData.batch,
        class_id: formData.class_id,
        custom_student_id: ''
      });
      
      setTimeout(() => {
        fetchData();
        setSuccess(null);
      }, 1500);
    } catch (error: unknown) {
      console.error('Error creating student:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to create student');
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this student?')) return;

    try {
      await studentsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const getClassInfo = (classId: number) => {
    const cls = classes.find(c => c.class_id === classId);
    return cls ? `${cls.course_name} - Sem ${cls.semester} - ${cls.section}` : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-700 text-xs mt-2 hover:text-red-900 underline">Dismiss</button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">✓ {success}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">👨‍🎓 Students</h1>
        <p className="text-gray-600">Manage student records and enrollments</p>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>➕</span>
          Add New Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Roll Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g., 116"
              value={formData.roll_number}
              onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Numeric identifier for the student within the year and course</p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Student Name</label>
            <input
              type="text"
              placeholder="Full name"
              value={formData.student_name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="1234567890"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Admission Year</label>
            <input
              type="number"
              min="2000"
              max="2100"
              value={formData.admission_year}
              onChange={(e) => handleAdmissionYearChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Batch (Auto-filled)</label>
            <input
              type="text"
              value={formData.batch}
              readOnly
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-purple-50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Class <span className="text-red-500">*</span></label>
            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.course_name} - Sem {cls.semester} - {cls.section}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Auto-Generated Student ID</label>
            <div className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-mono font-semibold">
              {previewStudentId || '(Select class, year, and enter roll number)'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: 0[YY]1[CourseCode][RollNumber], e.g., 0251bca116</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Custom Student ID (Optional)</label>
            <input
              type="text"
              placeholder="Leave empty to use auto-generated ID"
              value={formData.custom_student_id}
              onChange={(e) => setFormData({ ...formData, custom_student_id: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">For bulk imports or legacy records</p>
          </div>
        </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition shadow-md flex items-center gap-2"
            >
              <Plus size={18} /> Add Student
            </button>
          </div>
        </form>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Students ({students.length})</h2>
        {students.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-gray-500">No students yet</p>
          </div>
        ) : (
          <div className="space-y-3">
          {students.map((student) => (
            <div key={student.student_id} className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-100 rounded-lg p-5 hover:border-purple-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-lg">
                    <GraduationCap size={28} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-gray-900 text-white px-3 py-1 rounded-md text-sm font-mono font-bold">
                        {student.student_id}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{student.student_name}</h3>
                      {student.is_active && (
                        <span className="text-green-600 text-sm">● Active</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                      <div>📧 {student.email}</div>
                      <div>📱 {student.phone_number}</div>
                      <div>🎓 {getClassInfo(student.class_id)}</div>
                      <div>📅 Batch {student.batch} | Roll# {student.roll_number}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(student.student_id)}
                  className="text-gray-400 hover:text-red-600 transition ml-4"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};
