import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from './pages/Login';

import MainLayout from './layouts/MainLayout';
import UserLayout from './layouts/UserLayout';

import { GlobalToast } from './components/GlobalToast';

// School Pages (Tenant)
import SchoolDashboard from './pages/Tenant/School/Dashboard';
import SchoolStudents from './pages/Tenant/School/Students';
import SchoolAttendance from './pages/Tenant/School/Attendance';

// Hotel Pages (Tenant)
import HotelDashboard from './pages/Tenant/Hotel/Dashboard';
import HotelRooms from './pages/Tenant/Hotel/Rooms';
import HotelGuests from './pages/Tenant/Hotel/Guests';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import SuperAdminHardware from './pages/SuperAdmin/Hardware';
import SuperAdminAccounting from './pages/SuperAdmin/Accounting';
import SuperAdminLogs from './pages/SuperAdmin/AuditLogs';
import AdminGovPortal from './pages/SuperAdmin/GovPortal';

// User App Pages
import UserHome from './pages/UserApp/UserHome';
import UserWallet from './pages/UserApp/UserWallet';
import UserQR from './pages/UserApp/UserQR';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* SCHOOL PORTAL */}
        <Route path="/school" element={<MainLayout />}>
          <Route path="dashboard" element={<SchoolDashboard />} />
          <Route path="students" element={<SchoolStudents />} />
          <Route path="attendance" element={<SchoolAttendance />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* HOTEL PORTAL */}
        <Route path="/hotel" element={<MainLayout />}>
          <Route path="dashboard" element={<HotelDashboard />} />
          <Route path="rooms" element={<HotelRooms />} />
          <Route path="guests" element={<HotelGuests />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* SUPER ADMIN PORTAL */}
        <Route path="/superadmin" element={<MainLayout />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="hardware" element={<SuperAdminHardware />} />
          <Route path="accounting" element={<SuperAdminAccounting />} />
          <Route path="logs" element={<SuperAdminLogs />} />
          <Route path="gov-portal" element={<AdminGovPortal />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* USER APP (MOBILE) */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<UserHome />} />
          <Route path="wallet" element={<UserWallet />} />
          <Route path="qr" element={<UserQR />} />
          <Route index element={<Navigate to="home" replace />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalToast />
    </Router>
  );
}

export default App;
