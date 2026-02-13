import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Total Students</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">0</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Total Staff</div>
          <div className="text-3xl font-bold text-green-600 mt-2">0</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Total Classes</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">0</div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Total Rooms</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">0</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Timetable ERP System</h2>
        <p className="text-gray-600">
          This system helps manage your educational institution&apos;s timetable, attendance, staff, students, and more.
          Use the navigation menu on the left to access different modules.
        </p>
      </div>
    </div>
  );
};
