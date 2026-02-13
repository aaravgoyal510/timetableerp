import React, { useEffect, useState } from 'react';
import { roomAPI } from '../api';

interface Room {
  room_id: number;
  room_number: string;
  room_type: string;
  block_name: string;
  floor_number: number;
  capacity: number;
  has_projector: boolean;
  has_ac: boolean;
  computer_count: number;
  availability_status: string;
  is_active: boolean;
}

export const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: 'Classroom',
    block_name: '',
    floor_number: 1,
    capacity: 30,
    has_projector: false,
    has_ac: false,
    computer_count: 0,
    availability_status: 'Available',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getAll();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await roomAPI.create(formData);
      setFormData({
        room_number: '',
        room_type: 'Classroom',
        block_name: '',
        floor_number: 1,
        capacity: 30,
        has_projector: false,
        has_ac: false,
        computer_count: 0,
        availability_status: 'Available',
      });
      setShowForm(false);
      fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await roomAPI.delete(id);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Room'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <input
            type="text"
            placeholder="Room Number"
            value={formData.room_number}
            onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Room Type"
            value={formData.room_type}
            onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Block Name"
            value={formData.block_name}
            onChange={(e) => setFormData({ ...formData, block_name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Floor Number"
            value={formData.floor_number}
            onChange={(e) => setFormData({ ...formData, floor_number: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Computer Count"
            value={formData.computer_count}
            onChange={(e) => setFormData({ ...formData, computer_count: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.has_projector}
              onChange={(e) => setFormData({ ...formData, has_projector: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Has Projector</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.has_ac}
              onChange={(e) => setFormData({ ...formData, has_ac: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Has AC</span>
          </label>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Room
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Room Number</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Block</th>
                <th className="px-6 py-3 text-left">Floor</th>
                <th className="px-6 py-3 text-left">Capacity</th>
                <th className="px-6 py-3 text-left">Projector</th>
                <th className="px-6 py-3 text-left">AC</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.room_id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{room.room_number}</td>
                  <td className="px-6 py-4">{room.room_type}</td>
                  <td className="px-6 py-4">{room.block_name}</td>
                  <td className="px-6 py-4">{room.floor_number}</td>
                  <td className="px-6 py-4">{room.capacity}</td>
                  <td className="px-6 py-4">{room.has_projector ? '✓' : '✗'}</td>
                  <td className="px-6 py-4">{room.has_ac ? '✓' : '✗'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(room.room_id)}
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
