import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { api } from '../api';

interface TeacherSubjectMapping {
  staff_id: string;  // VARCHAR
  subject_code: string;  // VARCHAR
  staff_name?: string;
  subject_name?: string;
}

interface Staff {
  staff_id: string;  // VARCHAR
  staff_name: string;
}

interface Subject {
  subject_code: string;  // Primary key
  subject_name: string;
}

export const TeacherSubjectMap: React.FC = () => {
  const [mappings, setMappings] = useState<TeacherSubjectMapping[]>([]);
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    staff_id: '',
    subject_code: ''
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
      await api.post('/teacher-subject-map', {
        staff_id: formData.staff_id,
        subject_code: formData.subject_code
      });
      setFormData({ staff_id: '', subject_code: '' });
      setShowForm(false);
      fetchData();
    } catch (error: unknown) {
      console.error('Error creating mapping:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to create mapping');
      alert(typeof errorMessage === 'string' ? errorMessage : 'Failed to create mapping');
    }
  };

  const handleDelete = async (staffId: string, subjectCode: string) => {
    if (confirm('Are you sure?')) {
      try {
        // Use composite key format: staff_id_subject_code
        await api.delete(`/teacher-subject-map/${staffId}_${subjectCode}`);
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
              value={formData.subject_code}
              onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border px-3 py-2"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.subject_code} value={s.subject_code}>{s.subject_name} ({s.subject_code})</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mappings.map(mapping => (
              <tr key={`${mapping.staff_id}_${mapping.subject_code}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.staff_name || mapping.staff_id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.subject_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.subject_code}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(mapping.staff_id, mapping.subject_code)}
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
