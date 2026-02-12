import React, { useEffect, useState } from 'react';
import { api } from '../api';

interface TeacherSubjectMapping {
  teacher_subject_map_id: number;
  staff_id: number;
  subject_id: number;
  staff_name?: string;
  subject_name?: string;
  subject_code?: string;
  is_active: boolean;
}

interface Staff {
  staff_id: number;
  staff_name: string;
}

interface Subject {
  subject_id: number;
  subject_name: string;
  subject_code: string;
}

export const TeacherSubjectMap: React.FC = () => {
  const [mappings, setMappings] = useState<TeacherSubjectMapping[]>([]);
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    staff_id: '',
    subject_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersRes, subjectsRes] = await Promise.all([
        api.get('/staff'),
        api.get('/subjects')
      ]);
      setTeachers(teachersRes.data || []);
      setSubjects(subjectsRes.data || []);
      
      const mappingsRes = await api.get('/teacher-subject-map');
      setMappings(mappingsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/teacher-subject-map', formData);
      setFormData({ staff_id: '', subject_id: '', is_active: true });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating mapping:', error);
      alert('Failed to create mapping');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/teacher-subject-map/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting mapping:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Teacher Subject Assignment</h1>
      
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Assign Subject to Teacher'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Teacher</label>
            <select
              value={formData.staff_id}
              onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border px-3 py-2"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t.staff_id} value={t.staff_id}>{t.staff_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border px-3 py-2"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.subject_id} value={s.subject_id}>{s.subject_name} ({s.subject_code})</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Assign Subject
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mappings.map(mapping => (
              <tr key={mapping.teacher_subject_map_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.staff_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.subject_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.subject_code}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-white text-xs ${mapping.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                    {mapping.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(mapping.teacher_subject_map_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
