import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Calendar, LogOut, ArrowRight, BookmarkCheck, LayoutDashboard } from 'lucide-react';

export const Profile = () => {
  const { user, isStudent, isStaff, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-indigo-100">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" /> {user?.role} ACCOUNT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Institutional Email</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Phone Contact</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{user?.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Security Clearance</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{user?.role} Level</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Account ID</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">USER-#{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Quick Portal Navigation */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isStudent && (
              <Link
                to="/my-registrations"
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>My Registrations</span>
              </Link>
            )}
            {isStaff && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <Link
              to="/events"
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Browse Events
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
