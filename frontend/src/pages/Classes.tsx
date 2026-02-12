import React, { useEffect, useState } from 'react';
import { classAPI } from '../api';

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
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course_name: '',
    semester: 1,
    section: '',
    academic_year: '2024-2025',
    shift: 'Morning',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getAll();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await classAPI.create(formData);
      setFormData({
        course_name: '',
        semester: 1,
        section: '',
        academic_year: '2024-2025',
        shift: 'Morning',
      });
      setShowForm(false);
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await classAPI.delete(id);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Classes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Class'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <input
            type="text"
            placeholder="Course Name"
            value={formData.course_name}
            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
            min="1"
            max="8"
          />
          <input
            type="text"
            placeholder="Section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Academic Year"
            value={formData.academic_year}
            onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <select
            value={formData.shift}
            onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Class
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Course Name</th>
                <th className="px-6 py-3 text-left">Semester</th>
                <th className="px-6 py-3 text-left">Section</th>
                <th className="px-6 py-3 text-left">Academic Year</th>
                <th className="px-6 py-3 text-left">Shift</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.class_id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{cls.course_name}</td>
                  <td className="px-6 py-4">{cls.semester}</td>
                  <td className="px-6 py-4">{cls.section}</td>
                  <td className="px-6 py-4">{cls.academic_year}</td>
                  <td className="px-6 py-4">{cls.shift}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(cls.class_id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
