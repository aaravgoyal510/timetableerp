import React, { useEffect, useState } from 'react';
import { staffAvailabilityAPI, staffAPI, timeslotAPI } from '../api';
import { Plus, Calendar } from 'lucide-react';

interface StaffAvailability {
  availability_id: number;
  staff_id: string;  // VARCHAR
  timeslot_id: number;
  is_recurring: boolean;
  day_of_week?: string;
  date?: string;
  reason?: string;
  is_active: boolean;
}

interface Staff {
  staff_id: string;  // VARCHAR
  staff_name: string;
}

interface Timeslot {
  timeslot_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  shift: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const StaffAvailability: React.FC = () => {
  const [items, setItems] = useState<StaffAvailability[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    staff_id: '',
    timeslot_id: '',
    is_recurring: true,
    day_of_week: 'Monday',
    date: '',
    reason: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, timeslotRes, availabilityRes] = await Promise.all([
        staffAPI.getAll(),
        timeslotAPI.getAll(),
        staffAvailabilityAPI.getAll()
      ]);
      setStaff(staffRes.data || []);
      setTimeslots(timeslotRes.data || []);
      setItems(availabilityRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        staff_id: Number(formData.staff_id),
        timeslot_id: Number(formData.timeslot_id),
        is_recurring: formData.is_recurring,
        day_of_week: formData.is_recurring ? formData.day_of_week : undefined,
        date: formData.is_recurring ? undefined : formData.date,
        reason: formData.reason || undefined,
        is_active: formData.is_active
      };

      await staffAvailabilityAPI.create(payload);
      setFormData({
        staff_id: '',
        timeslot_id: '',
        is_recurring: true,
        day_of_week: 'Monday',
        date: '',
        reason: '',
        is_active: true
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating availability:', error);
      alert('Failed to create availability');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await staffAvailabilityAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting availability:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900"><Calendar className="inline mr-2" size={32} />Staff Availability</h1>
            <p className="text-gray-600 mt-1">Manage staff timeslot availability and blockages</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            {showForm ? 'Cancel' : <>
              <Plus size={20} />
              Block Timeslot
            </>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={20} />
            Block Staff Timeslot
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
              <select
                value={formData.staff_id}
                onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                required
            >
              <option value="">Select Staff</option>
              {staff.map((s) => (
                <option key={s.staff_id} value={s.staff_id}>{s.staff_name}</option>
              ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeslot</label>
              <select
                value={formData.timeslot_id}
                onChange={(e) => setFormData({ ...formData, timeslot_id: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                required
            >
              <option value="">Select Timeslot</option>
              {timeslots.map((t) => (
                <option key={t.timeslot_id} value={t.timeslot_id}>
                  {t.day_of_week} {t.start_time} - {t.end_time} ({t.shift})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_recurring}
              onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="text-sm font-medium text-gray-700">Recurring Block</label>
          </div>

          {formData.is_recurring ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                required
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Reason (optional)"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          />

          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md">
            Save Availability
          </button>
        </form>
      </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeslot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">When</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => {
              const staffMember = staff.find((s) => s.staff_id === item.staff_id);
              const timeslot = timeslots.find((t) => t.timeslot_id === item.timeslot_id);
              return (
                <tr key={item.availability_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{staffMember?.staff_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {timeslot ? `${timeslot.day_of_week} ${timeslot.start_time} - ${timeslot.end_time}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.is_recurring ? 'Recurring' : 'Date'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.is_recurring ? item.day_of_week : item.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.reason || '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(item.availability_id)}
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
