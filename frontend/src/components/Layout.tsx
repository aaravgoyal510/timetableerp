import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

interface Module {
  name: string;
  href: string;
  icon: string;
  description: string;
  requiredRoles?: string[];
}

const modules: Module[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '📊',
    description: 'Overview & Analytics',
  },
  {
    name: 'Departments',
    href: '/departments',
    icon: '🏢',
    description: 'Department Management',
    requiredRoles: ['Admin', 'HOD'],
  },
  {
    name: 'Classes',
    href: '/classes',
    icon: '🏫',
    description: 'Class Setup',
    requiredRoles: ['Admin', 'HOD', 'Faculty'],
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: '👨‍🏫',
    description: 'Staff Directory',
    requiredRoles: ['Admin', 'HOD'],
  },
  {
    name: 'Students',
    href: '/students',
    icon: '👨‍🎓',
    description: 'Student Database',
    requiredRoles: ['Admin', 'Faculty', 'HOD'],
  },
  {
    name: 'Subjects',
    href: '/subjects',
    icon: '📚',
    description: 'Subject Catalog',
    requiredRoles: ['Admin', 'HOD', 'Faculty'],
  },
  {
    name: 'Timeslots',
    href: '/timeslots',
    icon: '⏰',
    description: 'Time Management',
    requiredRoles: ['Admin', 'HOD'],
  },
  {
    name: 'Rooms',
    href: '/rooms',
    icon: '🚪',
    description: 'Room Allocation',
    requiredRoles: ['Admin', 'HOD'],
  },
  {
    name: 'Timetable',
    href: '/timetable',
    icon: '📅',
    description: 'Schedule Planning',
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: '✓',
    description: 'Track Attendance',
    requiredRoles: ['Admin', 'Faculty', 'Staff'],
  },
  {
    name: 'Room Allotment',
    href: '/room-allotment',
    icon: '🔑',
    description: 'Room Assignment',
    requiredRoles: ['Admin', 'HOD'],
  },
  {
    name: 'Holidays',
    href: '/holidays',
    icon: '🎉',
    description: 'Holiday Calendar',
    requiredRoles: ['Admin'],
  },
  {
    name: 'Roles',
    href: '/roles',
    icon: '👥',
    description: 'Manage Roles',
    requiredRoles: ['Admin'],
  },
  {
    name: 'Staff Roles',
    href: '/staff-role-map',
    icon: '🎓',
    description: 'Assign Roles',
    requiredRoles: ['Admin'],
  },
  {
    name: 'Staff Depts',
    href: '/staff-dept-map',
    icon: '🧭',
    description: 'Department Mapping',
    requiredRoles: ['Admin', 'HOD'],
  },
  {
    name: 'Student Roles',
    href: '/student-role-map',
    icon: '📋',
    description: 'Student Roles',
    requiredRoles: ['Admin'],
  },
  {
    name: 'Teacher Subjects',
    href: '/teacher-subject-map',
    icon: '📖',
    description: 'Subject Mapping',
    requiredRoles: ['Admin', 'HOD'],
  },
  {
    name: 'Staff Availability',
    href: '/staff-availability',
    icon: '🗓️',
    description: 'Availability Tracking',
    requiredRoles: ['Admin', 'HOD'],
  },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { staff, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredModules = modules.filter(module => {
    if (!module.requiredRoles) return true;
    return hasRole(module.requiredRoles);
  });

  const currentModule = filteredModules.find(m => m.href === location.pathname);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-lg font-bold text-white">
                📚
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Institution</h1>
                  <p className="text-xs text-gray-600">ERP System</p>
                </div>
              )}
            </div>
          </div>

          {sidebarOpen && staff && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-900">{staff.staff_name}</p>
              <p className="text-xs text-gray-600 mt-1">{staff.roles?.join(', ') || 'Staff'}</p>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {filteredModules.map((module) => {
            const isActive = location.pathname === module.href;
            return (
              <Link
                key={module.href}
                to={module.href}
                title={module.name}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg flex-shrink-0">{module.icon}</span>
                {sidebarOpen && <span className="truncate">{module.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-gray-200 ${!sidebarOpen && 'flex justify-center'}`}>
          {sidebarOpen ? (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentModule?.name || 'Dashboard'}
            </h2>
            {currentModule && (
              <p className="text-sm text-gray-600 mt-1">{currentModule.description}</p>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
