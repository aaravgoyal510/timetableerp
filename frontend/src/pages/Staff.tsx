import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { staffAPI } from '../api';

interface Staff {
  staff_id: number;
  staff_name: string;
  email: string;
  phone_number: string;
  department_id: number;
  designation: string;
  staff_type: string;
  is_active: boolean;
}

export const Staff: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    staff_name: '',
    email: '',
    phone_number: '',
    department_id: 1,
    designation: '',
    staff_type: 'Permanent',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffAPI.getAll();
      setStaff(response.data);
      setError(null);
    } catch (error: unknown) {
      console.error('Error fetching staff:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMsg = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to load staff');
      setError(`Failed to load staff: ${typeof errorMsg === 'string' ? errorMsg : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await staffAPI.create(formData);
      console.log('Staff created:', response.data);
      
      setSuccess('Staff member added successfully!');
      setFormData({
        staff_name: '',
        email: '',
        phone_number: '',
        department_id: 1,
        designation: '',
        staff_type: 'Permanent',
      });
      setShowForm(false);
      
      // Refresh the list after a short delay
      setTimeout(() => {
        fetchStaff();
        setSuccess(null);
      }, 1500);
    } catch (error: unknown) {
      console.error('Error creating staff:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to create staff');
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to create staff');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await staffAPI.delete(id);
        setSuccess('Staff member deleted successfully!');
        fetchStaff();
        setTimeout(() => setSuccess(null), 2000);
      } catch (error: unknown) {
        console.error('Error deleting staff:', error);
        const axiosError = error as AxiosError<Record<string, unknown>>;
        const errorMsg = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to delete');
        setError(`Failed to delete: ${typeof errorMsg === 'string' ? errorMsg : 'Unknown error'}`);
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
          <button
            onClick={() => setError(null)}
            className="text-red-700 text-xs mt-2 hover:text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">Success</p>
          <p className="text-green-700 text-sm mt-1">{success}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage teaching and non-teaching staff</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition shadow-sm"
          >
            {showForm ? 'Cancel' : '➕ Add Staff'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>➕</span>
            Add New Staff Member
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Name *</label>
              <input
                type="text"
                placeholder="e.g., Dr. John Smith"
                value={formData.staff_name}
                onChange={(e) => setFormData({ ...formData, staff_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                placeholder="e.g., john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                placeholder="e.g., 9999999999"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
              <input
                type="text"
                placeholder="e.g., Professor, Assistant Professor, Lecturer"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Type *</label>
              <select
                value={formData.staff_type}
                onChange={(e) => setFormData({ ...formData, staff_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              >
                <option value="Permanent">Permanent</option>
                <option value="Visiting">Visiting</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition shadow-sm w-full"
            >
              {submitting ? 'Creating...' : 'Create Staff'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Designation</th>
                <th className="px-6 py-3 text-left">Staff Type</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.staff_id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{member.staff_name}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">{member.designation}</td>
                  <td className="px-6 py-4">{member.staff_type}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(member.staff_id)}
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
