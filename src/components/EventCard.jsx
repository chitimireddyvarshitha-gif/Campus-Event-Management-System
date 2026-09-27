import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const categoryColors = {
  TECHNICAL: 'bg-blue-50 text-blue-700 border-blue-200',
  CULTURAL: 'bg-purple-50 text-purple-700 border-purple-200',
  SPORTS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ACADEMIC: 'bg-amber-50 text-amber-700 border-amber-200',
  OTHER: 'bg-slate-50 text-slate-700 border-slate-200',
};

const statusColors = {
  UPCOMING: 'bg-indigo-500 text-white',
  ONGOING: 'bg-emerald-500 text-white animate-pulse',
  COMPLETED: 'bg-slate-500 text-white',
  CANCELLED: 'bg-rose-500 text-white',
};

export const EventCard = ({ event }) => {
  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 1)) * 100)
  );

  const isFull = event.availableSeats <= 0;
  const isCancelled = event.status === 'CANCELLED';

  // Format date nicely
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Event Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase border ${
              categoryColors[event.category] || categoryColors.OTHER
            } shadow-xs backdrop-blur-md`}
          >
            {event.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase ${
              statusColors[event.status] || 'bg-slate-600 text-white'
            } shadow-xs`}
          >
            {event.status}
          </span>
        </div>

        {/* Registered status indicator if student already registered */}
        {event.isRegistered && (
          <div className="absolute bottom-3 left-3 bg-emerald-600/95 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            Registered
          </div>
        )}
      </div>

      {/* Event Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="font-semibold text-slate-800">{formattedDate}</span>
              <span className="text-slate-400">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{event.eventTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">Organized by {event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Capacity Bar & Action */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600 flex items-center gap-1">
              Available Seats:
              <strong className={`font-bold ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                {event.availableSeats} / {event.capacity}
              </strong>
            </span>
            <span className="text-slate-400">{percentFilled}% Filled</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull
                  ? 'bg-rose-500'
                  : percentFilled > 75
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/events/${event.id}`}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer bg-slate-900 hover:bg-indigo-600 text-white"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
