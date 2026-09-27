import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import {
  Layers,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  Calendar,
  Clock,
  RefreshCw,
  Search
} from 'lucide-react';

export const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await eventService.getAdminEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      setDeleting(true);
      setError('');
      setSuccessMessage('');

      const res = await eventService.deleteEvent(selectedEvent.id);
      if (res.success) {
        setSuccessMessage(`Event "${selectedEvent.title}" and its registrations were deleted successfully.`);
        setShowDeleteModal(false);
        setSelectedEvent(null);
        await fetchEvents();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Faculty Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create new event listings, modify schedules, inspect rosters, and oversee registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEvents}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh event list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <Link
            to="/admin/add-event"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Event</span>
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchEvents} />

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter events by title, organizer, category, or venue..."
          className="w-full text-xs sm:text-sm text-slate-700 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Events Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <Loading text="Loading faculty event records..." />
        ) : filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Event Title</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Date & Time</th>
                  <th scope="col" className="px-6 py-4">Venue</th>
                  <th scope="col" className="px-6 py-4">Registrations</th>
                  <th scope="col" className="px-6 py-4">Occupancy</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs">
                      <div className="text-sm font-bold text-slate-900 truncate">{e.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">By {e.organizer}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {e.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{e.eventDate}</div>
                      <div className="text-[11px] text-slate-400">{e.eventTime}</div>
                    </td>

                    <td className="px-6 py-4 max-w-[150px] truncate">
                      {e.venue}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{e.activeRegistrations}</span>
                      <span className="text-slate-400"> / {e.capacity}</span>
                      <div className="text-[10px] text-emerald-600 font-medium">
                        {e.availableSeats} seats left
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                          <span>{e.occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              e.occupancyRate >= 90
                                ? 'bg-rose-500'
                                : e.occupancyRate >= 60
                                ? 'bg-amber-500'
                                : 'bg-indigo-600'
                            }`}
                            style={{ width: `${e.occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          e.status === 'UPCOMING'
                            ? 'bg-blue-50 text-blue-700'
                            : e.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/events/${e.id}/students`}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-indigo-100 transition"
                          title="View Student Roster"
                        >
                          <Users className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/events/${e.id}`}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                          title="View Event Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/events/${e.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(e)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Create your first campus event to get started.
            </p>
            <Link
              to="/admin/add-event"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Add New Event
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Event?"
        message={`Are you sure you want to delete "${selectedEvent?.title}"? This will permanently remove the event and remove all student registrations from the database.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Event'}
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};

export default ManageEvents;
