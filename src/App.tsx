/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickLoginBar from './components/QuickLoginBar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import StudentDashboard from './pages/StudentDashboard';
import MyRegistrations from './pages/MyRegistrations';
import AdminDashboard from './pages/AdminDashboard';
import ManageEvents from './pages/ManageEvents';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import RegisteredStudents from './pages/RegisteredStudents';
import Profile from './pages/Profile';
import DatabaseViewer from './pages/DatabaseViewer';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
          {/* Quick Demo Switcher Bar for instant testing */}
          <QuickLoginBar />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/database" element={<DatabaseViewer />} />

              {/* Student Routes */}
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-registrations"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <MyRegistrations />
                  </ProtectedRoute>
                }
              />

              {/* Faculty & Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-events"
                element={
                  <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                    <ManageEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-event"
                element={
                  <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                    <AddEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:eventId/students"
                element={
                  <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                    <RegisteredStudents />
                  </ProtectedRoute>
                }
              />

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
