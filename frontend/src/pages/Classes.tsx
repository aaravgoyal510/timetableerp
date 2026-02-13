import React, { useEffect, useState } from 'react';
import { classesAPI } from '../api';
import { Plus, Trash2, Users } from 'lucide-react';

interface Class {
  class_id: number;
  course_name: string;
  semester: number;
  section: string;
  academic_year: string;
  shift: string;
  is_active: boolean;
}

export const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    course_name: '',
    semester: '1',
    section: 'A',
    academic_year: `${currentYear}-${currentYear + 1}`,
    shift: 'Morning',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await classesAPI.create({
        ...formData,
        semester: parseInt(formData.semester),
      });
      
      // Auto-increment section for next entry
      const nextSection = String.fromCharCode(formData.section.charCodeAt(0) + 1);
      setFormData({
        ...formData,
        section: nextSection <= 'Z' ? nextSection : 'A',
      });
      
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this class?')) return;

    try {
      await classesAPI.delete(id);
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        <p className="text-gray-600 mt-1">Manage class sections and schedules</p>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>➕</span>
          Add New Class
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Course Name</label>
              <input
                type="text"
                placeholder="e.g., B.Tech CSE"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Section</label>
              <input
                type="text"
                maxLength={2}
                placeholder="A, B, C..."
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Academic Year</label>
              <input
                type="text"
                placeholder="2024-2025"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-lg font-medium transition shadow-md"
            >
              Add Class
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🏫</span>
            All Classes ({classes.length})
          </h2>
        </div>
        {classes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-5xl mb-4">💭</div>
            <div className="font-medium">No classes yet</div>
            <div className="text-sm mt-1">Add your first class to get started</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {classes.map((cls) => (
            <div key={cls.class_id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cls.course_name}</h3>
                    <p className="text-sm text-gray-600">Section {cls.section}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cls.class_id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-md">Sem {cls.semester}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-md">{cls.shift}</span>
                </div>
                <p>📅 {cls.academic_year}</p>
                {cls.is_active && <span className="text-green-600 font-medium">● Active</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
