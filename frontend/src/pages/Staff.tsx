import React, { useEffect, useState } from 'react';
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
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await staffAPI.create(formData);
      setFormData({
        staff_name: '',
        email: '',
        phone_number: '',
        department_id: 1,
        designation: '',
        staff_type: 'Permanent',
      });
      setShowForm(false);
      fetchStaff();
    } catch (error) {
      console.error('Error creating staff:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await staffAPI.delete(id);
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <input
            type="text"
            placeholder="Staff Name"
            value={formData.staff_name}
            onChange={(e) => setFormData({ ...formData, staff_name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <select
            value={formData.staff_type}
            onChange={(e) => setFormData({ ...formData, staff_type: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Permanent">Permanent</option>
            <option value="Visiting">Visiting</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Staff
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
