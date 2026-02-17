import React, { useEffect, useState } from 'react';
import { timetableAPI, classesAPI, subjectsAPI, staffAPI, roomsAPI, timeslotAPI } from '../api';
import type { Class, Subject, Staff, Room, Timeslot } from '../types';
import { Calendar, Plus } from 'lucide-react';

interface Timetable {
  timetable_id?: number;
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
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
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
        classesAPI.getAll(),
        subjectsAPI.getAll(),
        staffAPI.getAll(),
        roomsAPI.getAll(),
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
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900"><Calendar className="inline mr-2" size={32} />Timetable</h1>
            <p className="text-gray-600 mt-1">Manage class schedules and timetable entries</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            {showForm ? 'Cancel' : <>
              <Plus size={20} />
              Add Entry
            </>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={20} />
            Add Timetable Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
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
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
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
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
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
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
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
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
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
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={formData.is_lab}
                onChange={(e) => setFormData({ ...formData, is_lab: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span>Is Lab Session</span>
            </label>
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md w-full">
              Create Entry
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
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
                        onClick={() => entry.timetable_id && handleDelete(entry.timetable_id)}
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
