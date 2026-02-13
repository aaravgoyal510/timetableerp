import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Departments', href: '/departments', icon: '🏢' },
  { name: 'Subjects', href: '/subjects', icon: '📚' },
  { name: 'Classes', href: '/classes', icon: '🏫' },
  { name: 'Students', href: '/students', icon: '👨‍🎓' },
  { name: 'Staff', href: '/staff', icon: '👨‍🏫' },
  { name: 'Rooms', href: '/rooms', icon: '🚪' },
  { name: 'Timeslots', href: '/timeslots', icon: '⏰' },
  { name: 'Timetable', href: '/timetable', icon: '📅' },
  { name: 'Attendance', href: '/attendance', icon: '✓' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { staff, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎓</div>
            <h1 className="text-xl font-bold">ERP Timetable System</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="font-medium">{staff?.staff_name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <div className="text-sm text-purple-100 mb-2">Switch between dashboards and modules</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium whitespace-nowrap transition
                    ${
                      isActive
                        ? 'bg-white text-purple-600'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
