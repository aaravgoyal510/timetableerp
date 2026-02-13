import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../api';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalSubjects: number;
  totalStaff: number;
  totalDepartments: number;
  totalRooms: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalStaff: 0,
    totalDepartments: 0,
    totalRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="text-orange-500">📦</span>
                {stats.totalClasses} classes
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-500">🏭</span>
                {stats.totalRooms} rooms
              </span>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md">
            📋 View Reports
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Students Card */}
        <Link to="/students" className="block">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600 mb-2">STUDENTS</div>
                <div className="text-4xl font-bold text-blue-600 mb-3">{stats.totalStudents}</div>
                <div className="text-xs text-gray-500">Total Enrolled Students</div>
              </div>
              <div className="text-4xl">👨‍🎓</div>
            </div>
          </div>
        </Link>

        {/* Staff Card */}
        <Link to="/staff" className="block">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600 mb-2">STAFF</div>
                <div className="text-4xl font-bold text-green-600 mb-3">{stats.totalStaff}</div>
                <div className="text-xs text-gray-500">Total Staff Members</div>
              </div>
              <div className="text-4xl">👨‍🏫</div>
            </div>
          </div>
        </Link>

        {/* Classes Card */}
        <Link to="/classes" className="block">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600 mb-2">CLASSES</div>
                <div className="text-4xl font-bold text-purple-600 mb-3">{stats.totalClasses}</div>
                <div className="text-xs text-gray-500">Active Classes</div>
              </div>
              <div className="text-4xl">🏫</div>
            </div>
          </div>
        </Link>

        {/* Rooms Card */}
        <Link to="/rooms" className="block">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600 mb-2">ROOMS</div>
                <div className="text-4xl font-bold text-orange-600 mb-3">{stats.totalRooms}</div>
                <div className="text-xs text-gray-500">Available Rooms</div>
              </div>
              <div className="text-4xl">🚪</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚡</span>
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/students"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white p-4 rounded-lg font-medium transition shadow-md"
          >
            <span className="text-2xl">➕</span>
            <span>Add Student</span>
          </Link>
          <Link
            to="/timetable"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white p-4 rounded-lg font-medium transition shadow-md"
          >
            <span className="text-2xl">📅</span>
            <span>Manage Timetable</span>
          </Link>
          <Link
            to="/attendance"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-4 rounded-lg font-medium transition shadow-md"
          >
            <span className="text-2xl">📊</span>
            <span>View Attendance</span>
          </Link>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subjects & Departments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📚</span>
            Academic Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  📖
                </div>
                <div>
                  <div className="font-medium text-gray-900">Subjects</div>
                  <div className="text-xs text-gray-500">Total subjects offered</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalSubjects}</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                  🏢
                </div>
                <div>
                  <div className="font-medium text-gray-900">Departments</div>
                  <div className="text-xs text-gray-500">Active departments</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalDepartments}</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            System Alerts
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-2xl">✅</div>
            <div className="flex-1">
              <div className="font-semibold text-green-900">All Good!</div>
              <div className="text-sm text-green-700 mt-1">No system issues detected. All modules are functioning normally.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
