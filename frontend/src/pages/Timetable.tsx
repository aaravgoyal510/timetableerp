import React, { useEffect, useState } from 'react';
import { timetableAPI, classAPI, subjectAPI, staffAPI, roomAPI, timeslotAPI } from '../api';

interface Timetable {
  timetable_id: number;
  class_id: number;
  subject_code: string;
  staff_id: number;
  room_id: number;
  timeslot_id: number;
  timetable_date: string;
  is_lab: boolean;
}

export const Timetable: React.FC = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [timeslots, setTimeslots] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    class_id: 1,
    subject_code: '',
    staff_id: 1,
    room_id: 1,
    timeslot_id: 1,
    timetable_date: '',
    is_lab: false,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [ttRes, clsRes, subRes, stfRes, rmRes, tsRes] = await Promise.all([
        timetableAPI.getAll(),
        classAPI.getAll(),
        subjectAPI.getAll(),
        staffAPI.getAll(),
        roomAPI.getAll(),
        timeslotAPI.getAll(),
      ]);
      setTimetables(ttRes.data);
      setClasses(clsRes.data);
      setSubjects(subRes.data);
      setStaff(stfRes.data);
      setRooms(rmRes.data);
      setTimeslots(tsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await timetableAPI.create(formData);
      setFormData({
        class_id: 1,
        subject_code: '',
        staff_id: 1,
        room_id: 1,
        timeslot_id: 1,
        timetable_date: '',
        is_lab: false,
      });
      setShowForm(false);
      fetchAllData();
    } catch (error) {
      console.error('Error creating timetable:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await timetableAPI.delete(id);
        fetchAllData();
      } catch (error) {
        console.error('Error deleting timetable:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Timetable</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <select
            value={formData.class_id}
            onChange={(e) => setFormData({ ...formData, class_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          >
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.course_name} - Sem {cls.semester}
              </option>
            ))}
          </select>
          <select
            value={formData.subject_code}
            onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.subject_code} value={sub.subject_code}>
                {sub.subject_name}
              </option>
            ))}
          </select>
          <select
            value={formData.staff_id}
            onChange={(e) => setFormData({ ...formData, staff_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          >
            {staff.map((s) => (
              <option key={s.staff_id} value={s.staff_id}>
                {s.staff_name}
              </option>
            ))}
          </select>
          <select
            value={formData.room_id}
            onChange={(e) => setFormData({ ...formData, room_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          >
            {rooms.map((r) => (
              <option key={r.room_id} value={r.room_id}>
                {r.room_number}
              </option>
            ))}
          </select>
          <select
            value={formData.timeslot_id}
            onChange={(e) => setFormData({ ...formData, timeslot_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          >
            {timeslots.map((ts) => (
              <option key={ts.timeslot_id} value={ts.timeslot_id}>
                {ts.day_of_week} {ts.start_time}-{ts.end_time}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.timetable_date}
            onChange={(e) => setFormData({ ...formData, timetable_date: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_lab}
              onChange={(e) => setFormData({ ...formData, is_lab: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Is Lab</span>
          </label>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Entry
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Staff</th>
                <th className="px-4 py-3 text-left">Room</th>
                <th className="px-4 py-3 text-left">Day/Time</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Lab</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetables.map((entry) => {
                const cls = classes.find((c) => c.class_id === entry.class_id);
                const subj = subjects.find((s) => s.subject_code === entry.subject_code);
                const stf = staff.find((s) => s.staff_id === entry.staff_id);
                const rm = rooms.find((r) => r.room_id === entry.room_id);
                const ts = timeslots.find((t) => t.timeslot_id === entry.timeslot_id);
                return (
                  <tr key={entry.timetable_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{cls?.course_name}</td>
                    <td className="px-4 py-3">{subj?.subject_name}</td>
                    <td className="px-4 py-3">{stf?.staff_name}</td>
                    <td className="px-4 py-3">{rm?.room_number}</td>
                    <td className="px-4 py-3">{ts?.day_of_week} {ts?.start_time}</td>
                    <td className="px-4 py-3">{entry.timetable_date}</td>
                    <td className="px-4 py-3">{entry.is_lab ? '✓' : '✗'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(entry.timetable_id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
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
      )}
    </div>
  );
};
