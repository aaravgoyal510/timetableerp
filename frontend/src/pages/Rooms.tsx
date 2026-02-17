import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { roomsAPI } from '../api';
import { Plus, Trash2, DoorOpen, MapPin, Users, Monitor, Film } from 'lucide-react';

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: 'Classroom',
    block_name: '',
    floor_number: '1',
    capacity: '30',
    has_projector: false,
    has_ac: false,
    computer_count: '0',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setSubmitting(true);
      await roomsAPI.create({
        ...formData,
        floor_number: parseInt(formData.floor_number),
        capacity: parseInt(formData.capacity),
        computer_count: parseInt(formData.computer_count),
        availability_status: 'Available'
      });
      
      setSuccess('Room added successfully!');
      setFormData({
        room_number: '',
        room_type: formData.room_type,
        block_name: formData.block_name,
        floor_number: formData.floor_number,
        capacity: formData.capacity,
        has_projector: formData.has_projector,
        has_ac: formData.has_ac,
        computer_count: formData.computer_count,
      });
      
      setTimeout(() => {
        fetchRooms();
        setSuccess(null);
      }, 1500);
    } catch (error: unknown) {
      console.error('Error creating room:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to create room');
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this room?')) return;

    try {
      await roomsAPI.delete(id);
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
        <p className="text-gray-600 mt-1">Manage classrooms and lab facilities</p>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={20} />
          Add New Room
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Room Number</label>
            <input
              type="text"
              placeholder="e.g., 101, Lab-A"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Room Type</label>
            <select
              value={formData.room_type}
              onChange={(e) => setFormData({ 
                ...formData, 
                room_type: e.target.value,
                computer_count: e.target.value === 'Lab' ? '30' : '0'
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Classroom">Classroom</option>
              <option value="Lab">Lab</option>
              <option value="Seminar Hall">Seminar Hall</option>
              <option value="Auditorium">Auditorium</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Block Name</label>
            <input
              type="text"
              placeholder="e.g., Block A"
              value={formData.block_name}
              onChange={(e) => setFormData({ ...formData, block_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Floor</label>
            <input
              type="number"
              min="0"
              max="10"
              value={formData.floor_number}
              onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Capacity</label>
            <input
              type="number"
              min="1"
              max="500"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Computers</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.computer_count}
              onChange={(e) => setFormData({ ...formData, computer_count: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.has_projector}
                onChange={(e) => setFormData({ ...formData, has_projector: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Projector</span>
            </label>
            <label className="flex items-center gap-2 mb-2 ml-4">
              <input
                type="checkbox"
                checked={formData.has_ac}
                onChange={(e) => setFormData({ ...formData, has_ac: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">AC</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            <Plus size={18} /> Add Room
          </button>
        </div>
      </form>
      </div>

      {/* List */}
      {rooms.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No rooms yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.room_id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <DoorOpen size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{room.room_number}</h3>
                    <p className="text-sm text-gray-600">{room.room_type}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(room.room_id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2"><MapPin size={16} /> {room.block_name} - Floor {room.floor_number}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2"><Users size={16} /> Capacity: {room.capacity}</span>
                </div>
                {room.computer_count > 0 && (
                  <div className="text-gray-600 flex items-center gap-2"><Monitor size={16} /> {room.computer_count} Computers</div>
                )}
                <div className="flex gap-2 mt-2">
                  {room.has_projector && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"><Film size={14} /> Projector</span>
                  )}
                  {room.has_ac && (
                    <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs">❄️ AC</span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs ${
                    room.availability_status === 'Available' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {room.availability_status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
