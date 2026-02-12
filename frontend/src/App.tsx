import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Staff } from './pages/Staff';
import { Classes } from './pages/Classes';
import { Subjects } from './pages/Subjects';
import { Timeslots } from './pages/Timeslots';
import { Rooms } from './pages/Rooms';
import { Timetable } from './pages/Timetable';
import { Attendance } from './pages/Attendance';
import { RoomAllotment } from './pages/RoomAllotment';
import { Holidays } from './pages/Holidays';
import { Roles } from './pages/Roles';
import { StaffRoleMap } from './pages/StaffRoleMap';
import { StudentRoleMap } from './pages/StudentRoleMap';
import { TeacherSubjectMap } from './pages/TeacherSubjectMap';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/timeslots" element={<Timeslots />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/room-allotment" element={<RoomAllotment />} />
            <Route path="/holidays" element={<Holidays />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/staff-role-map" element={<StaffRoleMap />} />
            <Route path="/student-role-map" element={<StudentRoleMap />} />
            <Route path="/teacher-subject-map" element={<TeacherSubjectMap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
