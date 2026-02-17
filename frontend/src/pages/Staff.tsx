import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { staffAPI, roleAPI, departmentsAPI, subjectsAPI, teacherSubjectMapAPI } from '../api';

interface Staff {
  staff_id: string;
  staff_name: string;
  email: string;
  phone_number: string;
  department_id: number;
  designation: string;
  staff_type: string;
  is_active: boolean;
  staff_role_map?: Array<{ role_id: number; roles_master?: { role_name?: string } }>;
  staff_dept_map?: Array<{ department_id: number; departments?: { name?: string } }>;
}

interface Role {
  role_id: number;
  role_name: string;
}

interface Department {
  department_id: number;
  name: string;
}

interface Subject {
  subject_code: string;
  subject_name: string;
}

interface TeacherSubjectMapEntry {
  staff_id: number;
  subject_code: string;
}

export const Staff: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectAssignments, setSubjectAssignments] = useState<Record<number, string[]>>({});
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [editAssignments, setEditAssignments] = useState({
    role_id: '',
    department_id: '',
    subject_codes: [] as string[]
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    custom_staff_id: '',
    joining_year: currentYear.toString(),
    staff_name: '',
    email: '',
    phone_number: '',
    department_id: 1,
    designation: '',
    staff_type: 'Permanent',
    role_id: '',
    subject_codes: [] as string[]
  });

  // Helper to generate staff_id preview: 0[YY]1FT[Sequential]
  const generateStaffIdPreview = () => {
    if (!formData.joining_year) return '';
    const yy = formData.joining_year.slice(-2);
    return `0${yy}1ft###`; // ### represents auto-incremented sequence
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const [staffRes, rolesRes, deptRes, subjectsRes, teacherSubjectsRes] = await Promise.all([
        staffAPI.getAll(),
        roleAPI.getAll(),
        departmentsAPI.getAll(),
        subjectsAPI.getAll(),
        teacherSubjectMapAPI.getAll()
      ]);
      setStaff(staffRes.data);
      setRoles(rolesRes.data || []);
      setDepartments(deptRes.data || []);
      setSubjects(subjectsRes.data || []);

      const assignments: Record<number, string[]> = {};
      (teacherSubjectsRes.data || []).forEach((row: TeacherSubjectMapEntry) => {
        if (!row?.staff_id || !row?.subject_code) return;
        if (!assignments[row.staff_id]) {
          assignments[row.staff_id] = [];
        }
        assignments[row.staff_id].push(row.subject_code);
      });
      setSubjectAssignments(assignments);
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
      const payload: Record<string, unknown> = {
        ...formData,
        role_id: Number(formData.role_id),
        joining_year: parseInt(formData.joining_year),
        subject_codes: formData.subject_codes
      };
      if (!formData.custom_staff_id) {
        delete payload.custom_staff_id;
      }
      const response = await staffAPI.create(payload);
      console.log('Staff created:', response.data);
      if (response.data?.pin) {
        alert(`Temporary PIN for ${response.data.staff_name}: ${response.data.pin}`);
      }
      
      setSuccess('Staff member added successfully!');
      setFormData({
        custom_staff_id: '',
        joining_year: currentYear.toString(),
        staff_name: '',
        email: '',
        phone_number: '',
        department_id: 1,
        designation: '',
        staff_type: 'Permanent',
        role_id: '',
        subject_codes: []
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

  const startEditAssignments = (member: Staff) => {
    const roleId = member.staff_role_map?.[0]?.role_id?.toString() || '';
    const subjectCodes = subjectAssignments[member.staff_id] || [];
    setEditingStaffId(member.staff_id);
    setEditAssignments({
      role_id: roleId,
      department_id: member.department_id?.toString() || '',
      subject_codes: subjectCodes
    });
  };

  const handleUpdateAssignments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffId) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await staffAPI.update(editingStaffId, {
        role_id: Number(editAssignments.role_id),
        department_id: Number(editAssignments.department_id),
        subject_codes: editAssignments.subject_codes
      });
      setSuccess('Assignments updated successfully!');
      setEditingStaffId(null);
      setEditAssignments({ role_id: '', department_id: '', subject_codes: [] });
      fetchStaff();
    } catch (error: unknown) {
      console.error('Error updating assignments:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to update assignments');
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to update assignments');
    } finally {
      setSubmitting(false);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joining Year *</label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={formData.joining_year}
                  onChange={(e) => setFormData({ ...formData, joining_year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Year of joining (e.g., 2025)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Generated Staff ID</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono font-semibold">
                  {generateStaffIdPreview() || '(Enter joining year)'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: 0[YY]1FT[Sequential], e.g., 0251ft002</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Staff ID (Optional)</label>
              <input
                type="text"
                placeholder="Leave empty to use auto-generated ID"
                value={formData.custom_staff_id}
                onChange={(e) => setFormData({ ...formData, custom_staff_id: e.target.value.toLowerCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">For bulk imports or legacy records</p>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Subjects</label>
              <select
                multiple
                value={formData.subject_codes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject_codes: Array.from(e.target.selectedOptions).map((opt) => opt.value)
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              >
                {subjects.map((subject) => (
                  <option key={subject.subject_code} value={subject.subject_code}>
                    {subject.subject_name} ({subject.subject_code})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple subjects.</p>
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

      {editingStaffId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Staff Assignments</h2>
          <form onSubmit={handleUpdateAssignments} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                value={editAssignments.department_id}
                onChange={(e) => setEditAssignments({ ...editAssignments, department_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                value={editAssignments.role_id}
                onChange={(e) => setEditAssignments({ ...editAssignments, role_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Subjects</label>
              <select
                multiple
                value={editAssignments.subject_codes}
                onChange={(e) =>
                  setEditAssignments({
                    ...editAssignments,
                    subject_codes: Array.from(e.target.selectedOptions).map((opt) => opt.value)
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              >
                {subjects.map((subject) => (
                  <option key={subject.subject_code} value={subject.subject_code}>
                    {subject.subject_name} ({subject.subject_code})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple subjects.</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                {submitting ? 'Saving...' : 'Save Assignments'}
              </button>
              <button
                type="button"
                onClick={() => setEditingStaffId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
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
                <th className="px-6 py-3 text-left">Staff ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Designation</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Subjects</th>
                <th className="px-6 py-3 text-left">Staff Type</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.staff_id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">{member.staff_id}</td>
                  <td className="px-6 py-4">{member.staff_name}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">{member.designation}</td>
                  <td className="px-6 py-4">
                    {departments.find((dept) => dept.department_id === member.department_id)?.name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    {member.staff_role_map?.[0]?.roles_master?.role_name ||
                      roles.find((role) => role.role_id === member.staff_role_map?.[0]?.role_id)?.role_name ||
                      '—'}
                  </td>
                  <td className="px-6 py-4">
                    {(subjectAssignments[member.staff_id] || [])
                      .map((code) => subjects.find((s) => s.subject_code === code)?.subject_name || code)
                      .join(', ') || '—'}
                  </td>
                  <td className="px-6 py-4">{member.staff_type}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => startEditAssignments(member)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm mr-2"
                    >
                      Edit Assignments
                    </button>
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
