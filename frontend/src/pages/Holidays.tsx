import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { holidaysAPI } from '../api';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface Holiday {
  holiday_id: number;
  holiday_date: string;
  holiday_name: string;
  description: string;
}

export const Holidays: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    holiday_date: '',
    holiday_name: '',
    description: ''
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await holidaysAPI.getAll();
      setHolidays(response.data || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
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
      // Only send holiday_date and holiday_name (backend doesn't accept description)
      await holidaysAPI.create({
        holiday_date: formData.holiday_date,
        holiday_name: formData.holiday_name
      });
      
      setSuccess('Holiday added successfully!');
      setFormData({
        holiday_date: '',
        holiday_name: '',
        description: ''
      });
      
      setTimeout(() => {
        fetchHolidays();
        setSuccess(null);
      }, 1500);
    } catch (error: unknown) {
      console.error('Error creating holiday:', error);
      const axiosError = error as AxiosError<Record<string, unknown>>;
      const errorMessage = axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Failed to create holiday');
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to create holiday');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this holiday?')) return;

    try {
      await holidaysAPI.delete(id);
      fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Holidays</h1>
        <p className="text-gray-600 mt-1">Manage academic year holidays</p>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>➕</span>
          Add New Holiday
        </h2>
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-700 text-xs mt-2 hover:text-red-900 underline">Dismiss</button>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-semibold">✓ {success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Holiday Date</label>
            <input
              type="date"
              value={formData.holiday_date}
              onChange={(e) => setFormData({ ...formData, holiday_date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Holiday Name</label>
            <input
              type="text"
              placeholder="e.g., Republic Day"
              value={formData.holiday_name}
              onChange={(e) => setFormData({ ...formData, holiday_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Description (Optional)</label>
          <input
            type="text"
            placeholder="Additional details..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            <Plus size={18} /> Add Holiday
          </button>
        </div>
      </form>
      </div>

      {/* List */}
      {holidays.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No holidays scheduled</p>
      ) : (
        <div className="space-y-3">
          {holidays.sort((a, b) => new Date(a.holiday_date).getTime() - new Date(b.holiday_date).getTime()).map((holiday) => (
            <div key={holiday.holiday_id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Calendar size={24} className="text-orange-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{holiday.holiday_name}</h3>
                    <p className="text-sm text-gray-600 mb-1">📅 {formatDate(holiday.holiday_date)}</p>
                    {holiday.description && (
                      <p className="text-sm text-gray-500">{holiday.description}</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(holiday.holiday_id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
