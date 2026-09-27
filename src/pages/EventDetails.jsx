import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Ban,
  ArrowLeft,
  Share2,
  BookmarkCheck,
  Edit,
  UserCheck,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent, isStaff } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await eventService.getEventById(id);
      if (res.success && res.data) {
        setEvent(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id, user]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    try {
      setRegistering(true);
      setError('');
      setSuccessMessage('');

      const res = await registrationService.registerForEvent(id);
      if (res.success) {
        setSuccessMessage('🎉 Successfully registered for this event! Your seat has been reserved.');
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Re-fetch event to update available seats and registered status
        await fetchEventDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check event capacity and deadline.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!event?.userRegistrationId) return;

    try {
      setCancelling(true);
      setError('');
      setSuccessMessage('');

      const res = await registrationService.cancelRegistration(event.userRegistrationId);
      if (res.success) {
        setShowCancelModal(false);
        setSuccessMessage('Your registration was successfully cancelled and your seat released.');
        await fetchEventDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Loading text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link
          to="/events"
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  // Evaluation of registration constraints (JE Module)
  const isDeadlinePassed = new Date().getTime() > new Date(event.registrationDeadline).getTime();
  const isFull = event.availableSeats <= 0;
  const isCancelled = event.status === 'CANCELLED';
  const isOngoing = event.status === 'ONGOING';
  const isCompleted = event.status === 'COMPLETED';

  const canRegister =
    !event.isRegistered &&
    !isFull &&
    !isDeadlinePassed &&
    !isCancelled &&
    !isCompleted;

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedDeadline = new Date(event.registrationDeadline).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Events
        </Link>

        {isStaff && (
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/events/${event.id}/edit`}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" /> Edit Event
            </Link>
            <Link
              to={`/admin/events/${event.id}/students`}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" /> View Registered Students
            </Link>
          </div>
        )}
      </div>

      <ErrorMessage message={error} />

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Event Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-72 sm:h-96 w-full bg-slate-900">
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges on Banner */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wider uppercase bg-white/90 text-indigo-900 shadow-md backdrop-blur-md">
              {event.category}
            </span>
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wider uppercase text-white shadow-md ${
                event.status === 'UPCOMING'
                  ? 'bg-indigo-600'
                  : event.status === 'CANCELLED'
                  ? 'bg-rose-600'
                  : 'bg-slate-700'
              }`}
            >
              {event.status}
            </span>
          </div>

          {/* Title on Banner */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {event.title}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Organized by <strong className="text-white">{event.organizer}</strong>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description & Information */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                About The Event
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {event.description}
              </p>
            </div>

            {/* Event Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Date & Schedule</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{formattedDate}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" /> Starts at {event.eventTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Campus Venue</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{event.venue}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Physical Campus Location</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                  <Clock3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Registration Closes</p>
                  <p className={`text-xs font-bold mt-0.5 ${isDeadlinePassed ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formattedDeadline}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isDeadlinePassed ? 'Deadline Passed' : 'Strict capacity limit applies'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Seat Capacity</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {event.availableSeats} Seats Left / {event.capacity} Total
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {event.registeredCount || 0} students currently registered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card (Module JE Core) */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900 mb-1 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-indigo-600" /> Registration Status
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Instant database reservation with automated seat countdown
              </p>

              {/* Status Banner */}
              {event.isRegistered ? (
                <div className="p-4 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-900 mb-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You are registered for this event!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Your seat is secured. Present your student ID at {event.venue} on {event.eventDate}.
                  </p>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="mt-2 w-full py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition cursor-pointer"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isCancelled ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium mb-5 flex items-center gap-2">
                  <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>This event has been cancelled by the faculty coordinator.</span>
                </div>
              ) : isDeadlinePassed ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium mb-5 flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>The registration deadline for this event has passed.</span>
                </div>
              ) : isFull ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium mb-5 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Event is at maximum capacity ({event.capacity} seats filled).</span>
                </div>
              ) : null}

              {/* Registration Action Button */}
              {canRegister && (
                <div className="space-y-3">
                  {!isAuthenticated ? (
                    <div>
                      <p className="text-xs text-slate-600 mb-2">
                        Sign in as a student to register for this event.
                      </p>
                      <Link
                        to="/login"
                        state={{ from: { pathname: `/events/${id}` } }}
                        className="w-full block text-center py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                      >
                        Sign In to Register
                      </Link>
                    </div>
                  ) : !isStudent ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                      Faculty and Admin accounts cannot register as student participants.
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      {registering ? 'Reserving Seat...' : 'Register for Event'}
                    </button>
                  )}
                </div>
              )}

              {/* Registration Summary Stats */}
              <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
                <div className="flex justify-between">
                  <span>Available Seats:</span>
                  <strong className="text-slate-800">{event.availableSeats}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Registrations:</span>
                  <strong className="text-slate-800">{event.registeredCount || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <strong className="text-slate-800">{event.capacity}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Cancellation */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Cancel Event Registration?"
        message="Are you sure you want to cancel your registration for this event? Your seat will be made immediately available for other students."
        confirmText={cancelling ? 'Cancelling...' : 'Yes, Cancel Registration'}
        cancelText="Keep My Seat"
        isDestructive={true}
        onConfirm={handleCancelRegistration}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};

export default EventDetails;
