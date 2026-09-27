import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import registrationService from '../services/registrationService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Ban
} from 'lucide-react';

export const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedReg, setSelectedReg] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
      setError(err.response?.data?.message || 'Failed to fetch registered events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  const handleOpenCancelModal = (reg) => {
    setSelectedReg(reg);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReg) return;
    try {
      setCancelling(true);
      setError('');
      setSuccessMessage('');

      const res = await registrationService.cancelRegistration(selectedReg.id);
      if (res.success) {
        setSuccessMessage(`Registration for "${selectedReg.event?.title || 'the event'}" was successfully cancelled. Your seat has been released.`);
        setShowCancelModal(false);
        setSelectedReg(null);
        await fetchRegistrations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Participation Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed bookings, venues, and manage your campus registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRegistrations}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <Link
            to="/events"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
          >
            Browse More Events
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchRegistrations} />

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registrations Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <Loading text="Loading your registration records..." />
        ) : registrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Event Details</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Event Date & Time</th>
                  <th scope="col" className="px-6 py-4">Venue</th>
                  <th scope="col" className="px-6 py-4">Booked On</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => {
                  const isRegistered = reg.status === 'REGISTERED';
                  const isCancelled = reg.status === 'CANCELLED';

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <Link
                          to={`/events/${reg.eventId}`}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition block max-w-xs truncate"
                        >
                          {reg.event?.title || `Event #${reg.eventId}`}
                        </Link>
                        <span className="text-[11px] text-slate-400">Booking Ref: #{reg.id}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {reg.event?.category || 'GENERAL'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{reg.event?.eventDate}</div>
                        <div className="text-[11px] text-slate-400">{reg.event?.eventTime}</div>
                      </td>

                      <td className="px-6 py-4 max-w-xs truncate">
                        {reg.event?.venue || 'TBA'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(reg.registrationDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4">
                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            Cancelled
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/events/${reg.eventId}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
                          >
                            Details
                          </Link>

                          {isRegistered ? (
                            <button
                              onClick={() => handleOpenCancelModal(reg)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic px-2">Released</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Registrations Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
              You haven't registered for any events yet. Check out the latest technical hackathons, cultural festivals, and sports events.
            </p>
            <Link
              to="/events"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              Browse Campus Events
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Cancellation */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Cancel This Registration?"
        message={`Are you sure you want to cancel your registration for "${selectedReg?.event?.title}"? Cancelled registrations cannot be counted toward your attendance, and your seat will be released immediately.`}
        confirmText={cancelling ? 'Cancelling...' : 'Yes, Cancel Registration'}
        cancelText="Keep My Booking"
        isDestructive={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setShowCancelModal(false);
          setSelectedReg(null);
        }}
      />
    </div>
  );
};

export default MyRegistrations;
