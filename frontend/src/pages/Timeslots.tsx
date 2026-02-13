import React, { useEffect, useState } from 'react';
import { timeslotAPI } from '../api';

interface Timeslot {
  timeslot_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_number: number;
  is_break: boolean;
  shift: string;
}

export const Timeslots: React.FC = () => {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
    slot_number: 1,
    is_break: false,
    shift: 'Morning',
  });

  useEffect(() => {
    fetchTimeslots();
  }, []);

  const fetchTimeslots = async () => {
    try {
      setLoading(true);
      const response = await timeslotAPI.getAll();
      setTimeslots(response.data);
    } catch (error) {
      console.error('Error fetching timeslots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await timeslotAPI.create(formData);
      setFormData({
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '10:00',
        slot_number: 1,
        is_break: false,
        shift: 'Morning',
      });
      setShowForm(false);
      fetchTimeslots();
    } catch (error) {
      console.error('Error creating timeslot:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await timeslotAPI.delete(id);
        fetchTimeslots();
      } catch (error) {
        console.error('Error deleting timeslot:', error);
      }
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Timeslots</h1>
            <p className="text-gray-600 mt-1">Configure class timings and schedules</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
          >
            {showForm ? 'Cancel' : '➕ Add Timeslot'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>➕</span>
            Add New Timeslot
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.day_of_week}
            onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Slot Number"
            value={formData.slot_number}
            onChange={(e) => setFormData({ ...formData, slot_number: parseInt(e.target.value) })}
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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_break}
              onChange={(e) => setFormData({ ...formData, is_break: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Is Break</span>
          </label>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Timeslot
          </button>
        </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Day</th>
                <th className="px-6 py-3 text-left">Start Time</th>
                <th className="px-6 py-3 text-left">End Time</th>
                <th className="px-6 py-3 text-left">Slot #</th>
                <th className="px-6 py-3 text-left">Shift</th>
                <th className="px-6 py-3 text-left">Break</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeslots.map((slot) => (
                <tr key={slot.timeslot_id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{slot.day_of_week}</td>
                  <td className="px-6 py-4">{slot.start_time}</td>
                  <td className="px-6 py-4">{slot.end_time}</td>
                  <td className="px-6 py-4">{slot.slot_number}</td>
                  <td className="px-6 py-4">{slot.shift}</td>
                  <td className="px-6 py-4">{slot.is_break ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(slot.timeslot_id)}
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
