import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import eventService from '../services/eventService';
import EventForm from '../components/EventForm';
import ErrorMessage from '../components/ErrorMessage';
import { PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AddEvent = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (eventData) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const res = await eventService.createEvent(eventData);
      if (res.success) {
        setSuccess('Event successfully created and published to campus students!');
        setTimeout(() => {
          navigate('/admin/manage-events');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please verify all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/manage-events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Manage Events
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Campus Event
            </h1>
            <p className="text-xs text-slate-500">
              Provide event schedule, domain, capacity limits, and venue details
            </p>
          </div>
        </div>

        <ErrorMessage message={error} />

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <EventForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  );
};

export default AddEvent;
