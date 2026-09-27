import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import eventService from '../services/eventService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Mail,
  Phone,
  Search,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

export const RegisteredStudents = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [allEvents, setAllEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [eventData, setEventData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load all events for dropdown switcher
  useEffect(() => {
    const loadEventsList = async () => {
      try {
        const res = await eventService.getAdminEvents();
        if (res.success && res.data) {
          setAllEvents(res.data);
          if (!selectedEventId && res.data.length > 0) {
            setSelectedEventId(res.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Error fetching events list:', err);
      }
    };
    loadEventsList();
  }, []);

  // Fetch registrations for selected event
  const fetchRoster = async (idToFetch) => {
    if (!idToFetch) return;
    try {
      setLoading(true);
      setError('');
      const res = await eventService.getEventRegistrations(idToFetch);
      if (res.success && res.data) {
        setEventData(res.data.event);
        setRegistrations(res.data.registrations || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student registrations roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchRoster(selectedEventId);
    }
  }, [selectedEventId]);

  const handleEventChange = (e) => {
    const newId = e.target.value;
    setSelectedEventId(newId);
    navigate(`/admin/events/${newId}/students`, { replace: true });
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.studentEmail.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.studentPhone.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/manage-events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Manage Events
        </Link>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Select Event:
          </label>
          <select
            value={selectedEventId}
            onChange={handleEventChange}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs max-w-xs truncate"
          >
            {allEvents.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.eventDate})
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchRoster(selectedEventId)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={() => fetchRoster(selectedEventId)} />

      {/* Event Header & Capacity Stats Banner */}
      {eventData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                Participant Attendance Roster
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {eventData.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Official student registration database records and contact details.
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <p className="text-[10px] font-bold text-indigo-700 uppercase">Capacity</p>
                <p className="text-xl font-extrabold text-indigo-900 mt-0.5">{eventData.capacity}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <p className="text-[10px] font-bold text-emerald-700 uppercase">Registered</p>
                <p className="text-xl font-extrabold text-emerald-900 mt-0.5">{eventData.totalRegistered}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-600 uppercase">Available</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{eventData.availableSeats}</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by student name, email, phone..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({registrations.length})
              </button>
              <button
                onClick={() => setStatusFilter('REGISTERED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'REGISTERED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Active ({registrations.filter((r) => r.status === 'REGISTERED').length})
              </button>
              <button
                onClick={() => setStatusFilter('CANCELLED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'CANCELLED' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cancelled ({registrations.filter((r) => r.status === 'CANCELLED').length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <Loading text="Retrieving student participants roster..." />
        ) : filteredRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Student Name</th>
                  <th scope="col" className="px-6 py-4">College Email</th>
                  <th scope="col" className="px-6 py-4">Phone Number</th>
                  <th scope="col" className="px-6 py-4">Registration Date</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((student) => (
                  <tr key={student.registrationId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-extrabold">
                        {student.studentName?.charAt(0) || 'S'}
                      </div>
                      <span>{student.studentName}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.studentEmail}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.studentPhone}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {new Date(student.registrationDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.status === 'REGISTERED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          <XCircle className="w-3 h-3 text-slate-400" /> Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Students Registered Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No student registrations currently match your filter criteria for this event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredStudents;
