import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { staffDeptMapAPI, staffAPI, departmentsAPI } from '../api';

interface StaffDeptMap {
  staff_dept_map_id: number;
  staff_id: number;
  department_id: number;
  is_active: boolean;
}

interface Staff {
  staff_id: number;
  staff_name: string;
}

interface Department {
  department_id: number;
  name: string;
}

export const StaffDeptMap: React.FC = () => {
  const [mappings, setMappings] = useState<StaffDeptMap[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    staff_id: '',
    department_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, deptRes, mapRes] = await Promise.all([
        staffAPI.getAll(),
        departmentsAPI.getAll(),
        staffDeptMapAPI.getAll()
      ]);
      setStaff(staffRes.data || []);
      setDepartments(deptRes.data || []);
      setMappings(mapRes.data || []);
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
      await staffDeptMapAPI.create({
        staff_id: Number(formData.staff_id),
        department_id: Number(formData.department_id),
        is_active: formData.is_active
      });
      setSuccess('Department assigned to staff successfully!');
      setFormData({ staff_id: '', department_id: '', is_active: true });
      setShowForm(false);
      setTimeout(() => {
        fetchData();
        setSuccess(null);
      }, 1500);
    } catch (error: unknown) {
      console.error('Error creating mapping:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to assign department');
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to assign department');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await staffDeptMapAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting mapping:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

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
      
      <h1 className="text-4xl font-bold text-gray-800">Staff Departments</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Assign Department to Staff'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Staff Member</label>
            <select
              value={formData.staff_id}
              onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border px-3 py-2"
              required
            >
              <option value="">Select Staff</option>
              {staff.map((s) => (
                <option key={s.staff_id} value={s.staff_id}>{s.staff_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border px-3 py-2"
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>{d.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Assign Department
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mappings.map((mapping) => {
              const staffMember = staff.find((s) => s.staff_id === mapping.staff_id);
              const department = departments.find((d) => d.department_id === mapping.department_id);
              return (
                <tr key={mapping.staff_dept_map_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{staffMember?.staff_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{department?.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-white text-xs ${mapping.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                      {mapping.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(mapping.staff_dept_map_id)}
                      className="text-red-600 hover:text-red-900"
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
    </div>
  );
};
