import React, { useEffect, useState } from 'react';
import { roomAllotmentAPI, roomAPI, classAPI, staffAPI, subjectAPI, timeslotAPI } from '../api';

interface RoomAllotment {
  booking_id: number;
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
  const [rooms, setRooms] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [timeslots, setTimeslots] = useState<any[]>([]);
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
    try {
      await roomAllotmentAPI.create(formData);
      setFormData({
        room_id: 1,
        class_id: 1,
        staff_id: 1,
        subject_code: '',
        timeslot_id: 1,
        allotment_date: '',
      });
      setShowForm(false);
      fetchAllData();
    } catch (error) {
      console.error('Error creating allotment:', error);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Room Allotment</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Allotment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <select
            value={formData.room_id}
            onChange={(e) => setFormData({ ...formData, room_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
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
            className="w-full px-4 py-2 border rounded"
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
            className="w-full px-4 py-2 border rounded"
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
            value={formData.timeslot_id}
            onChange={(e) => setFormData({ ...formData, timeslot_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
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
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Allotment
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
                        onClick={() => handleDelete(all.booking_id)}
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
