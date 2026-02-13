import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
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
import { Departments } from './pages/Departments';
import { StaffRoleMap } from './pages/StaffRoleMap';
import { StaffDeptMap } from './pages/StaffDeptMap';
import { StudentRoleMap } from './pages/StudentRoleMap';
import { TeacherSubjectMap } from './pages/TeacherSubjectMap';
import { StaffAvailability } from './pages/StaffAvailability';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><Layout><Students /></Layout></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute><Layout><Staff /></Layout></ProtectedRoute>} />
      <Route path="/classes" element={<ProtectedRoute><Layout><Classes /></Layout></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><Layout><Subjects /></Layout></ProtectedRoute>} />
      <Route path="/timeslots" element={<ProtectedRoute><Layout><Timeslots /></Layout></ProtectedRoute>} />
      <Route path="/rooms" element={<ProtectedRoute><Layout><Rooms /></Layout></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><Layout><Timetable /></Layout></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
      <Route path="/room-allotment" element={<ProtectedRoute><Layout><RoomAllotment /></Layout></ProtectedRoute>} />
      <Route path="/holidays" element={<ProtectedRoute><Layout><Holidays /></Layout></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><Layout><Roles /></Layout></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><Layout><Departments /></Layout></ProtectedRoute>} />
      <Route path="/staff-role-map" element={<ProtectedRoute><Layout><StaffRoleMap /></Layout></ProtectedRoute>} />
      <Route path="/staff-dept-map" element={<ProtectedRoute><Layout><StaffDeptMap /></Layout></ProtectedRoute>} />
      <Route path="/student-role-map" element={<ProtectedRoute><Layout><StudentRoleMap /></Layout></ProtectedRoute>} />
      <Route path="/teacher-subject-map" element={<ProtectedRoute><Layout><TeacherSubjectMap /></Layout></ProtectedRoute>} />
      <Route path="/staff-availability" element={<ProtectedRoute><Layout><StaffAvailability /></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
