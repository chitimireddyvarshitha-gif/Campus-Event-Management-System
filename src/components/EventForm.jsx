import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Image, AlertCircle, Save } from 'lucide-react';

export const EventForm = ({ initialData = {}, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'TECHNICAL',
    eventDate: initialData.eventDate || '',
    eventTime: initialData.eventTime || '10:00',
    venue: initialData.venue || '',
    organizer: initialData.organizer || '',
    capacity: initialData.capacity || 100,
    registrationDeadline: initialData.registrationDeadline ? initialData.registrationDeadline.substring(0, 16) : '',
    imageUrl: initialData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    status: initialData.status || 'UPCOMING',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.eventDate) errs.eventDate = 'Event date is required';
    if (!formData.eventTime) errs.eventTime = 'Event time is required';
    if (!formData.venue.trim()) errs.venue = 'Venue is required';
    if (!formData.organizer.trim()) errs.organizer = 'Organizer is required';
    if (!formData.capacity || parseInt(formData.capacity, 10) <= 0) {
      errs.capacity = 'Capacity must be greater than 0';
    }
    if (!formData.registrationDeadline) {
      errs.registrationDeadline = 'Registration deadline is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      capacity: parseInt(formData.capacity, 10),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. HackCampus 2026: 24-Hour AI & Web Hackathon"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.title
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
          >
            <option value="TECHNICAL">TECHNICAL (Hackathons, Coding, Robotics)</option>
            <option value="CULTURAL">CULTURAL (Music, Dance, Drama, Arts)</option>
            <option value="SPORTS">SPORTS (Athletics, Tournaments)</option>
            <option value="ACADEMIC">ACADEMIC (Symposiums, Workshops, Seminars)</option>
            <option value="OTHER">OTHER (Expos, Career Fairs)</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Event Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
          >
            <option value="UPCOMING">UPCOMING (Open for viewing/registering)</option>
            <option value="ONGOING">ONGOING (Event in progress)</option>
            <option value="COMPLETED">COMPLETED (Event finished)</option>
            <option value="CANCELLED">CANCELLED (Registrations closed)</option>
          </select>
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Event Date *
          </label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.eventDate
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.eventDate && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.eventDate}</p>}
        </div>

        {/* Event Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" /> Event Time (HH:mm) *
          </label>
          <input
            type="text"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            placeholder="e.g. 09:30 or 14:00"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.eventTime
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.eventTime && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.eventTime}</p>}
        </div>

        {/* Venue */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" /> Venue *
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g. Computer Science Auditorium"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.venue
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.venue && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.venue}</p>}
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" /> Organizer *
          </label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            placeholder="e.g. Dept. of Computer Science & ACM Chapter"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.organizer
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.organizer && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.organizer}</p>}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Maximum Capacity (Seats) *
          </label>
          <input
            type="number"
            min="1"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.capacity
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.capacity && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.capacity}</p>}
        </div>

        {/* Registration Deadline */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Registration Deadline (Date & Time) *
          </label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.registrationDeadline
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.registrationDeadline && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.registrationDeadline}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-indigo-500" /> Header Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Provide a direct image URL (Unsplash or college web server)
          </p>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Event Description & Schedule *
          </label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed overview of the event, eligibility, agenda, guest speakers, prizes, and requirements..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              errors.description
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.description}</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving Event...' : 'Save & Publish Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
