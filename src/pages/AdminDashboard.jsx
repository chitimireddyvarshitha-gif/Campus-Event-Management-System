import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckCircle,
  PlusCircle,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isFaculty, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await eventService.getAdminDashboard();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Faculty Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            <LayoutDashboard className="w-3.5 h-3.5" />
            {isAdmin ? 'Campus Administration Control' : 'Faculty Event Management'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time registration statistics, capacity monitoring, and event management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <Link
            to="/admin/manage-events"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Manage Events</span>
          </Link>
          <Link
            to="/admin/add-event"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Event</span>
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchDashboardData} />

      {loading ? (
        <Loading text="Compiling campus metrics and registration data..." />
      ) : stats ? (
        <>
          {/* Key Metric Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Events
                </span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{stats.totalEvents}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                <span className="text-indigo-600 font-semibold">{stats.upcomingEvents} Upcoming</span>
                <span>•</span>
                <span>{stats.completedEvents} Completed</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Registrations
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-600">{stats.activeRegistrations}</p>
              <div className="text-[11px] text-slate-500 mt-1">
                Out of {stats.totalRegistrations} total booking requests
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Upcoming Events
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{stats.upcomingEvents}</p>
              <div className="text-[11px] text-slate-500 mt-1">
                Open for student registration
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Cancelled / Released
                </span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-700">{stats.cancelledRegistrations}</p>
              <div className="text-[11px] text-slate-500 mt-1">
                Seats reclaimed into pool
              </div>
            </div>
          </div>

          {/* Category Breakdown & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="font-extrabold text-base text-slate-900">Events by Category</h2>
              <div className="space-y-3 pt-2">
                {Object.entries(stats.categoryBreakdown || {}).map(([cat, count]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{cat}</span>
                      <span className="text-slate-500 font-semibold">{count} events</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{
                          width: `${stats.totalEvents > 0 ? (count / stats.totalEvents) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-base text-slate-900">Recent Student Registrations</h2>
                <Link
                  to="/admin/manage-events"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  View All Events <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {stats.recentRegistrations?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Student</th>
                        <th className="px-4 py-2.5">Event</th>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.recentRegistrations.slice(0, 5).map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {r.studentName}
                            <span className="text-[10px] text-slate-400 block font-normal">{r.studentEmail}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-[200px] truncate">
                            {r.eventTitle}
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(r.registrationDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                r.status === 'REGISTERED'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-6 text-center">No recent registrations logged.</p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
