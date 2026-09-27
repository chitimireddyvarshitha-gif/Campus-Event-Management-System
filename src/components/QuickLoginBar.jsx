import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import { UserCheck, Sparkles, RotateCcw, ShieldCheck, GraduationCap, Check } from 'lucide-react';

export const QuickLoginBar = ({ onResetSuccess = () => {} }) => {
  const { user, quickLogin, isAuthenticated } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleQuickLogin = async (roleKey) => {
    try {
      await quickLogin(roleKey);
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Reset all events and registrations back to initial sample state?')) return;
    try {
      setResetting(true);
      await eventService.resetDatabase();
      setResetMessage('Database reset successfully!');
      setTimeout(() => setResetMessage(''), 3000);
      if (onResetSuccess) onResetSuccess();
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> Quick Demo Switcher:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleQuickLogin('STUDENT_1')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer font-medium ${
                user?.email === 'student1@college.edu'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Alex Rivera - Student 1 (student1@college.edu)"
            >
              <GraduationCap className="w-3 h-3 text-emerald-300" />
              Student 1 (Alex)
              {user?.email === 'student1@college.edu' && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            <button
              onClick={() => handleQuickLogin('STUDENT_2')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer font-medium ${
                user?.email === 'student2@college.edu'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Priya Sharma - Student 2 (student2@college.edu)"
            >
              <GraduationCap className="w-3 h-3 text-emerald-300" />
              Student 2 (Priya)
              {user?.email === 'student2@college.edu' && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            <button
              onClick={() => handleQuickLogin('FACULTY')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer font-medium ${
                user?.email === 'faculty@college.edu'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Dr. Robert Chen - Faculty (faculty@college.edu)"
            >
              <ShieldCheck className="w-3 h-3 text-indigo-300" />
              Faculty (Dr. Chen)
              {user?.email === 'faculty@college.edu' && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            <button
              onClick={() => handleQuickLogin('ADMIN')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer font-medium ${
                user?.email === 'admin@college.edu'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Prof. Vance - Admin (admin@college.edu)"
            >
              <ShieldCheck className="w-3 h-3 text-purple-300" />
              Admin (Prof. Vance)
              {user?.email === 'admin@college.edu' && <Check className="w-3 h-3 ml-0.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {resetMessage && (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> {resetMessage}
            </span>
          )}
          <button
            onClick={handleResetDb}
            disabled={resetting}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            title="Reset database to fresh sample state"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin text-amber-400' : ''}`} />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLoginBar;
