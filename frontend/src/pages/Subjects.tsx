import React, { useEffect, useState } from 'react';
import { subjectsAPI, departmentsAPI } from '../api';
import { Plus, Trash2 } from 'lucide-react';

interface Subject {
  subject_code: string;
  subject_name: string;
  course_name: string;
  department_id: number;
  semester: number;
  credits: number;
  hours_per_week: number;
  is_lab: boolean;
  duration_years: number;
  is_active: boolean;
}

interface Department {
  department_id: number;
  name: string;
}

export const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    course_name: '',
    department_id: '',
    semester: '1',
    credits: '3',
    hours_per_week: '3',
    is_lab: false,
    duration_years: '1',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, deptsRes] = await Promise.all([
        subjectsAPI.getAll(),
        departmentsAPI.getAll(),
      ]);
      setSubjects(subjectsRes.data || []);
      setDepartments(deptsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department_id) {
      alert('Please select a department');
      return;
    }

    try {
      setSubmitting(true);
      await subjectsAPI.create({
        ...formData,
        department_id: parseInt(formData.department_id),
        semester: parseInt(formData.semester),
        credits: parseInt(formData.credits),
        hours_per_week: parseInt(formData.hours_per_week),
        duration_years: parseInt(formData.duration_years),
      });
      
      setFormData({
        subject_code: '',
        subject_name: '',
        course_name: '',
        department_id: '',
        semester: '1',
        credits: '3',
        hours_per_week: '3',
        is_lab: false,
        duration_years: '1',
      });
      
      fetchData();
    } catch (error) {
      console.error('Error creating subject:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm('Delete this subject?')) return;

    try {
      await subjectsAPI.delete(code);
      fetchData();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const getDepartmentName = (id: number) => {
    return departments.find(d => d.department_id === id)?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
        <p className="text-gray-600">Manage subjects by department</p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Subject Code (e.g., CS101)"
            value={formData.subject_code}
            onChange={(e) => setFormData({ ...formData, subject_code: e.target.value.toUpperCase() })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Subject Name"
            value={formData.subject_name}
            onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formData.department_id}
            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Course Name (optional)"
            value={formData.course_name}
            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Semester</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Credits</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hours/Week</label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.hours_per_week}
              onChange={(e) => setFormData({ ...formData, hours_per_week: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Duration (Years)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.duration_years}
              onChange={(e) => setFormData({ ...formData, duration_years: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_lab}
              onChange={(e) => setFormData({ ...formData, is_lab: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Laboratory Subject</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="ml-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={18} /> Add Subject
          </button>
        </div>
      </form>

      {/* List */}
      {subjects.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No subjects yet</p>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => (
            <div key={subject.subject_code} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-mono font-semibold">
                      {subject.subject_code}
                    </span>
                    {subject.is_lab && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm">Lab</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{subject.subject_name}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span>📚 {getDepartmentName(subject.department_id)}</span>
                    <span>📖 Sem {subject.semester}</span>
                    <span>✨ {subject.credits} Credits</span>
                    <span>⏰ {subject.hours_per_week}h/week</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(subject.subject_code)}
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
  );
};
