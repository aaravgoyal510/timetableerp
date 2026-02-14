import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import './index.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Students = lazy(() => import('./pages/Students'));
const Staff = lazy(() => import('./pages/Staff'));
const Classes = lazy(() => import('./pages/Classes'));
const Subjects = lazy(() => import('./pages/Subjects'));
const Timeslots = lazy(() => import('./pages/Timeslots'));
const Rooms = lazy(() => import('./pages/Rooms'));
const Timetable = lazy(() => import('./pages/Timetable'));
const Attendance = lazy(() => import('./pages/Attendance'));
const RoomAllotment = lazy(() => import('./pages/RoomAllotment'));
const Holidays = lazy(() => import('./pages/Holidays'));
const Roles = lazy(() => import('./pages/Roles'));
const Departments = lazy(() => import('./pages/Departments'));
const StaffRoleMap = lazy(() => import('./pages/StaffRoleMap'));
const StaffDeptMap = lazy(() => import('./pages/StaffDeptMap'));
const StudentRoleMap = lazy(() => import('./pages/StudentRoleMap'));
const TeacherSubjectMap = lazy(() => import('./pages/TeacherSubjectMap'));
const StaffAvailability = lazy(() => import('./pages/StaffAvailability'));
const Login = lazy(() => import('./pages/Login'));

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
