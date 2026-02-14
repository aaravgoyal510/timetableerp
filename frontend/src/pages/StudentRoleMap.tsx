import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { api } from '../api';

interface StudentRoleMapping {
  student_role_map_id: number;
  student_id: number;
  role_id: number;
  student_name?: string;
  role_name?: string;
  is_active: boolean;
}

interface Student {
  student_id: number;
  student_name: string;
}

interface Role {
  role_id: number;
  role_name: string;
}

export const StudentRoleMap: React.FC = () => {
  const [mappings, setMappings] = useState<StudentRoleMapping[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    role_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, rolesRes] = await Promise.all([
        api.get('/students'),
        api.get('/roles')
      ]);
      setStudents(studentsRes.data || []);
      setRoles(rolesRes.data || []);
      
      const mappingsRes = await api.get('/student-role-map');
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
      await api.post('/student-role-map', formData);
      setFormData({ student_id: '', role_id: '', is_active: true });
      setShowForm(false);
      fetchData();
    } catch (error: unknown) {
      console.error('Error creating mapping:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to create mapping');
      alert(typeof errorMessage === 'string' ? errorMessage : 'Failed to create mapping');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/student-role-map/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting mapping:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Student & Roles</h1>
      
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Assign Role to Student'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student</label>
            <select
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border px-3 py-2"
              required
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>{s.student_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border px-3 py-2"
              required
            >
              <option value="">Select Role</option>
              {roles.map(r => (
                <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Assign Role
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mappings.map(mapping => (
              <tr key={mapping.student_role_map_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.student_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{mapping.role_name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-white text-xs ${mapping.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                    {mapping.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(mapping.student_role_map_id)}
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
