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

interface StatCard {
  label: string;
  value: number;
  description: string;
  icon: string;
  href: string;
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

  const statCards: StatCard[] = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      description: 'Active enrollments',
      icon: '👨‍🎓',
      href: '/students',
    },
    {
      label: 'Total Staff',
      value: stats.totalStaff,
      description: 'Faculty & staff',
      icon: '👨‍🏫',
      href: '/staff',
    },
    {
      label: 'Active Classes',
      value: stats.totalClasses,
      description: 'Running classes',
      icon: '🏫',
      href: '/classes',
    },
    {
      label: 'Total Subjects',
      value: stats.totalSubjects,
      description: 'Course catalog',
      icon: '📚',
      href: '/subjects',
    },
    {
      label: 'Departments',
      value: stats.totalDepartments,
      description: 'Organization',
      icon: '🏢',
      href: '/departments',
    },
    {
      label: 'Available Rooms',
      value: stats.totalRooms,
      description: 'Classroom spaces',
      icon: '🚪',
      href: '/rooms',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 text-lg">
              You have {stats.totalStudents} students, {stats.totalStaff} staff members, and {stats.totalClasses} active classes
            </p>
          </div>
          <div className="text-6xl">📊</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <Link key={card.href} to={card.href}>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{card.icon}</div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{card.label}</p>
                  <p className="text-xs text-gray-600">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/attendance" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition">
            <div className="text-3xl mb-3">✓</div>
            <h4 className="font-bold text-gray-900 mb-1">Mark Attendance</h4>
            <p className="text-sm text-gray-600">Track daily attendance</p>
          </Link>

          <Link to="/timetable" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition">
            <div className="text-3xl mb-3">📅</div>
            <h4 className="font-bold text-gray-900 mb-1">View Timetable</h4>
            <p className="text-sm text-gray-600">Check schedule</p>
          </Link>

          <Link to="/room-allotment" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition">
            <div className="text-3xl mb-3">🔑</div>
            <h4 className="font-bold text-gray-900 mb-1">Room Allocation</h4>
            <p className="text-sm text-gray-600">Manage room assignments</p>
          </Link>

          <Link to="/holidays" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition">
            <div className="text-3xl mb-3">🎉</div>
            <h4 className="font-bold text-gray-900 mb-1">Holidays</h4>
            <p className="text-sm text-gray-600">View holidays</p>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">⚙️</div>
            <h3 className="text-lg font-bold text-gray-900">System Status</h3>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">✓ All Systems Operational</p>
            <p className="text-sm text-green-700 mt-1">No issues detected. All modules are working perfectly.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">📈</div>
            <h3 className="text-lg font-bold text-gray-900">Today&apos;s Overview</h3>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-gray-700 font-semibold mt-2">
              {stats.totalClasses > 0 ? `${stats.totalClasses} classes scheduled` : 'No classes scheduled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
