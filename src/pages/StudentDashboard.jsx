import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import registrationService from '../services/registrationService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  GraduationCap,
  Calendar,
  BookmarkCheck,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRegistrations = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await registrationService.getStudentRegistrations(user.id);
      if (res.success && res.data) {
        setRegistrations(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  const activeRegistrations = registrations.filter((r) => r.status === 'REGISTERED');
  const cancelledRegistrations = registrations.filter((r) => r.status === 'CANCELLED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Welcome Card */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-extrabold shadow-inner">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-3.5 h-3.5" /> Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-normal">
              {user?.email} • {user?.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/events"
            className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>Discover Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/my-registrations"
            className="px-5 py-2.5 bg-indigo-950/60 hover:bg-indigo-950/80 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>My Bookings</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Registrations
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{activeRegistrations.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Confirmed spots for upcoming events</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Participations
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{registrations.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Lifetime registrations created</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cancelled Bookings
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{cancelledRegistrations.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Spots released back to students</p>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchRegistrations} />

      {/* Upcoming Active Events Roster */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              My Active Registered Events
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Events you are scheduled to attend. Keep your student ID ready at the venue.
            </p>
          </div>
          <Link
            to="/my-registrations"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading your event schedule..." />
        ) : activeRegistrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 bg-slate-50/50 hover:bg-white transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                      {reg.event?.category || 'CAMPUS EVENT'}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Confirmed
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                    {reg.event?.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{reg.event?.eventDate} at {reg.event?.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate">{reg.event?.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Registered: {new Date(reg.registrationDate).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/events/${reg.eventId}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No active registrations</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
              You haven't registered for any upcoming events yet. Browse our schedule and reserve your seat!
            </p>
            <Link
              to="/events"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Browse Campus Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
