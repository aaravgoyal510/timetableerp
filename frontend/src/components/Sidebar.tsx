import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Navigation {
  name: string;
  href: string;
  icon: string;
}

const navigation: Navigation[] = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Students', href: '/students', icon: '👨‍🎓' },
  { name: 'Staff', href: '/staff', icon: '👨‍🏫' },
  { name: 'Classes', href: '/classes', icon: '🏫' },
  { name: 'Subjects', href: '/subjects', icon: '📚' },
  { name: 'Timeslots', href: '/timeslots', icon: '⏰' },
  { name: 'Rooms', href: '/rooms', icon: '🚪' },
  { name: 'Timetable', href: '/timetable', icon: '📅' },
  { name: 'Attendance', href: '/attendance', icon: '✓' },
  { name: 'Room Allotment', href: '/room-allotment', icon: '🔑' },
  { name: 'Holidays', href: '/holidays', icon: '🎉' },
  { name: 'Roles', href: '/roles', icon: '👥' },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 min-h-screen flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">Timetable ERP</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-blue-800 rounded"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 transition ${
              location.pathname === item.href
                ? 'bg-blue-700 border-l-4 border-white'
                : 'hover:bg-blue-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
