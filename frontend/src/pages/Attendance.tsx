import React, { useEffect, useState } from 'react';
import { attendanceAPI, studentsAPI as studentAPI, classesAPI as classAPI, subjectsAPI as subjectAPI, staffAPI, timeslotAPI } from '../api';
import type { Student, Class, Subject, Staff, Timeslot } from '../types';

interface Attendance {
  attendance_id?: number;
  student_id: string;  // VARCHAR
  class_id: number;
  subject_code: string;
  staff_id: string;  // VARCHAR
  timeslot_id: number;
  attendance_date: string;
  status: string;
}

export const Attendance: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    student_id: 1,
    class_id: 1,
    subject_code: '',
    staff_id: 1,
    timeslot_id: 1,
    attendance_date: '',
    status: 'Present',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [attRes, stdRes, clsRes, subRes, stfRes, tsRes] = await Promise.all([
        attendanceAPI.getAll(),
        studentAPI.getAll(),
        classAPI.getAll(),
        subjectAPI.getAll(),
        staffAPI.getAll(),
        timeslotAPI.getAll(),
      ]);
      setAttendances(attRes.data);
      setStudents(stdRes.data);
      setClasses(clsRes.data);
      setSubjects(subRes.data);
      setStaff(stfRes.data);
      setTimeslots(tsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await attendanceAPI.create(formData);
      setSuccess('Attendance marked successfully!');
      setFormData({
        student_id: 1,
        class_id: 1,
        subject_code: '',
        staff_id: 1,
        timeslot_id: 1,
        attendance_date: '',
        status: 'Present',
      });
      setShowForm(false);
      setTimeout(() => {
        fetchAllData();
        setSuccess(null);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating attendance:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to mark attendance';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await attendanceAPI.delete(id);
        fetchAllData();
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
    }
  };

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">✅ Attendance</h1>
            <p className="text-gray-600 mt-1">Track and manage student attendance</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
          >
            {showForm ? 'Cancel' : '➕ Mark Attendance'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>➕</span>
            Mark New Attendance
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {students.map((std) => (
              <option key={std.student_id} value={std.student_id}>
                {std.student_name} ({std.roll_number})
              </option>
            ))}
            </select>
            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.course_name}
              </option>
            ))}
            </select>
            <select
              value={formData.subject_code}
              onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.subject_code} value={sub.subject_code}>
                {sub.subject_name}
              </option>
            ))}
            </select>
            <select
              value={formData.staff_id}
              onChange={(e) => setFormData({ ...formData, staff_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {staff.map((s) => (
              <option key={s.staff_id} value={s.staff_id}>
                {s.staff_name}
              </option>
            ))}
            </select>
            <select
              value={formData.timeslot_id}
              onChange={(e) => setFormData({ ...formData, timeslot_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {timeslots.map((ts) => (
              <option key={ts.timeslot_id} value={ts.timeslot_id}>
                {ts.day_of_week} {ts.start_time}-{ts.end_time}
              </option>
            ))}
            </select>
            <input
              type="date"
              value={formData.attendance_date}
              onChange={(e) => setFormData({ ...formData, attendance_date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md w-full">
              Mark Attendance
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Staff</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((att) => {
                const std = students.find((s) => s.student_id === att.student_id);
                const subj = subjects.find((s) => s.subject_code === att.subject_code);
                const stf = staff.find((s) => s.staff_id === att.staff_id);
                return (
                  <tr key={att.attendance_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{std?.student_name}</td>
                    <td className="px-4 py-3">{subj?.subject_name}</td>
                    <td className="px-4 py-3">{stf?.staff_name}</td>
                    <td className="px-4 py-3">{att.attendance_date}</td>
                    <td className={`px-4 py-3 font-semibold ${att.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                      {att.status}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => att.attendance_id && handleDelete(att.attendance_id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
