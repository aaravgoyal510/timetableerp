import React, { useEffect, useState } from 'react';
import { roomAllotmentAPI, roomsAPI as roomAPI, classesAPI as classAPI, staffAPI, subjectsAPI as subjectAPI, timeslotAPI } from '../api';
import type { Room, Class, Staff, Subject, Timeslot } from '../types';

interface RoomAllotment {
  booking_id?: number;
  room_id: number;
  class_id: number;
  staff_id: number;
  subject_code: string;
  timeslot_id: number;
  allotment_date: string;
}

export const RoomAllotment: React.FC = () => {
  const [allotments, setAllotments] = useState<RoomAllotment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    room_id: 1,
    class_id: 1,
    staff_id: 1,
    subject_code: '',
    timeslot_id: 1,
    allotment_date: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [raRes, rmRes, clsRes, stfRes, subRes, tsRes] = await Promise.all([
        roomAllotmentAPI.getAll(),
        roomAPI.getAll(),
        classAPI.getAll(),
        staffAPI.getAll(),
        subjectAPI.getAll(),
        timeslotAPI.getAll(),
      ]);
      setAllotments(raRes.data);
      setRooms(rmRes.data);
      setClasses(clsRes.data);
      setStaff(stfRes.data);
      setSubjects(subRes.data);
      setTimeslots(tsRes.data);
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
      await roomAllotmentAPI.create(formData);
      setSuccess('Room allotment created successfully!');
      setFormData({
        room_id: 1,
        class_id: 1,
        staff_id: 1,
        subject_code: '',
        timeslot_id: 1,
        allotment_date: '',
      });
      setShowForm(false);
      setTimeout(() => {
        fetchAllData();
        setSuccess(null);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating allotment:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create allotment';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await roomAllotmentAPI.delete(id);
        fetchAllData();
      } catch (error) {
        console.error('Error deleting allotment:', error);
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
          <button onClick={() => setError(null)} className="text-red-700 text-xs mt-2 hover:text-red-900 underline">Dismiss</button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">✓ {success}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📍 Room Allotment</h1>
            <p className="text-gray-600 mt-1">Allocate rooms for classes and activities</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
          >
            {showForm ? 'Cancel' : '➕ New Allotment'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>➕</span>
            Create Room Allotment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.room_id}
              onChange={(e) => setFormData({ ...formData, room_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_number} ({room.room_type})
              </option>
            ))}
            </select>
            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.course_name}
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
              value={formData.timeslot_id}
              onChange={(e) => setFormData({ ...formData, timeslot_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
          >
            {timeslots.map((ts) => (
              <option key={ts.timeslot_id} value={ts.timeslot_id}>
                {ts.day_of_week} {ts.start_time}
              </option>
            ))}
            </select>
            <input
              type="date"
              value={formData.allotment_date}
              onChange={(e) => setFormData({ ...formData, allotment_date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md w-full">
              Create Allotment
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
                <th className="px-4 py-3 text-left">Room</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Staff</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allotments.map((all) => {
                const room = rooms.find((r) => r.room_id === all.room_id);
                const cls = classes.find((c) => c.class_id === all.class_id);
                const subj = subjects.find((s) => s.subject_code === all.subject_code);
                const stf = staff.find((s) => s.staff_id === all.staff_id);
                return (
                  <tr key={all.booking_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{room?.room_number}</td>
                    <td className="px-4 py-3">{cls?.course_name}</td>
                    <td className="px-4 py-3">{subj?.subject_name}</td>
                    <td className="px-4 py-3">{stf?.staff_name}</td>
                    <td className="px-4 py-3">{all.allotment_date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => all.booking_id && handleDelete(all.booking_id)}
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
