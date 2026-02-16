import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Navigation {
  name: string;
  href: string;
  icon: string;
  requiredRoles?: string[];
}

const navigation: Navigation[] = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Students', href: '/students', icon: '👨‍🎓', requiredRoles: ['Admin', 'Faculty', 'HOD'] },
  { name: 'Staff', href: '/staff', icon: '👨‍🏫', requiredRoles: ['Admin', 'HOD'] },
  { name: 'Classes', href: '/classes', icon: '🏫', requiredRoles: ['Admin', 'HOD', 'Faculty'] },
  { name: 'Subjects', href: '/subjects', icon: '📚', requiredRoles: ['Admin', 'HOD', 'Faculty'] },
  { name: 'Timeslots', href: '/timeslots', icon: '⏰', requiredRoles: ['Admin', 'HOD'] },
  { name: 'Rooms', href: '/rooms', icon: '🚪', requiredRoles: ['Admin', 'HOD'] },
  { name: 'Timetable', href: '/timetable', icon: '📅' },
  { name: 'Attendance', href: '/attendance', icon: '✓', requiredRoles: ['Admin', 'Faculty', 'Staff'] },
  { name: 'Room Allotment', href: '/room-allotment', icon: '🔑', requiredRoles: ['Admin', 'HOD'] },
  { name: 'Holidays', href: '/holidays', icon: '🎉', requiredRoles: ['Admin'] },
  { name: 'Roles', href: '/roles', icon: '👥', requiredRoles: ['Admin'] },
  { name: 'Departments', href: '/departments', icon: '🏢', requiredRoles: ['Admin', 'HOD'] },
  { name: 'Student Roles', href: '/student-role-map', icon: '📋', requiredRoles: ['Admin'] },
  { name: 'Staff Availability', href: '/staff-availability', icon: '🗓️', requiredRoles: ['Admin', 'HOD'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { staff, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredNav = navigation.filter(item => {
    if (!item.requiredRoles) return true;
    return hasRole(item.requiredRoles);
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Institution ERP</h1>
        {staff && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-900">{staff.staff_name}</p>
            <p className="text-xs text-gray-500">{staff.roles.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm ${
              location.pathname === item.href
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
