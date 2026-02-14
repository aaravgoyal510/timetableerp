import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import './index.css';

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Students = lazy(() => import('./pages/Students').then((m) => ({ default: m.Students })));
const Staff = lazy(() => import('./pages/Staff').then((m) => ({ default: m.Staff })));
const Classes = lazy(() => import('./pages/Classes').then((m) => ({ default: m.Classes })));
const Subjects = lazy(() => import('./pages/Subjects').then((m) => ({ default: m.Subjects })));
const Timeslots = lazy(() => import('./pages/Timeslots').then((m) => ({ default: m.Timeslots })));
const Rooms = lazy(() => import('./pages/Rooms').then((m) => ({ default: m.Rooms })));
const Timetable = lazy(() => import('./pages/Timetable').then((m) => ({ default: m.Timetable })));
const Attendance = lazy(() => import('./pages/Attendance').then((m) => ({ default: m.Attendance })));
const RoomAllotment = lazy(() => import('./pages/RoomAllotment').then((m) => ({ default: m.RoomAllotment })));
const Holidays = lazy(() => import('./pages/Holidays').then((m) => ({ default: m.Holidays })));
const Roles = lazy(() => import('./pages/Roles').then((m) => ({ default: m.Roles })));
const Departments = lazy(() => import('./pages/Departments').then((m) => ({ default: m.Departments })));
const StaffRoleMap = lazy(() => import('./pages/StaffRoleMap').then((m) => ({ default: m.StaffRoleMap })));
const StaffDeptMap = lazy(() => import('./pages/StaffDeptMap').then((m) => ({ default: m.StaffDeptMap })));
const StudentRoleMap = lazy(() => import('./pages/StudentRoleMap').then((m) => ({ default: m.StudentRoleMap })));
const TeacherSubjectMap = lazy(() => import('./pages/TeacherSubjectMap').then((m) => ({ default: m.TeacherSubjectMap })));
const StaffAvailability = lazy(() => import('./pages/StaffAvailability').then((m) => ({ default: m.StaffAvailability })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

function AppContent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
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
