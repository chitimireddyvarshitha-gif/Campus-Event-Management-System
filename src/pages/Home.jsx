import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import Loading from '../components/Loading';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Cpu,
  Music,
  Trophy,
  BookOpen
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, isStudent, isStaff } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getEvents();
        if (res.success && res.data) {
          // Take first 3-4 upcoming events
          setFeaturedEvents(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [
    {
      name: 'Technical',
      key: 'TECHNICAL',
      desc: 'Hackathons, coding challenges, robotics and AI workshops',
      icon: Cpu,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Cultural',
      key: 'CULTURAL',
      desc: 'Music battles, classical dance, acoustic nights, drama',
      icon: Music,
      color: 'from-purple-600 to-fuchsia-600',
      bgLight: 'bg-purple-50 text-purple-600',
    },
    {
      name: 'Sports',
      key: 'SPORTS',
      desc: 'Cricket, football, badminton tournaments and athletics',
      icon: Trophy,
      color: 'from-emerald-600 to-teal-600',
      bgLight: 'bg-emerald-50 text-emerald-600',
    },
    {
      name: 'Academic',
      key: 'ACADEMIC',
      desc: 'International research symposiums, career expos, seminars',
      icon: BookOpen,
      color: 'from-amber-600 to-orange-600',
      bgLight: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Official University Campus Portal
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Discover, Register & Excel at <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-sky-300 to-purple-400">Campus Events</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Your centralized gateway for college hackathons, cultural festivals, inter-department sports tournaments, and academic symposiums. Automated registration with instant seat reservation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/events"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {isAuthenticated ? (
              isStudent ? (
                <Link
                  to="/student-dashboard"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
                >
                  My Student Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/dashboard"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
                >
                  Faculty Dashboard
                </Link>
              )
            ) : (
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
              >
                Create Student Account
              </Link>
            )}
          </div>

          {/* Quick Metrics Banner */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <p className="text-2xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-400">Automated Registration</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-indigo-400">Real-Time</p>
              <p className="text-xs text-slate-400">Seat Capacity Tracking</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">JWT</p>
              <p className="text-xs text-slate-400">Role-Based Security</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-400">MySQL</p>
              <p className="text-xs text-slate-400">Relational Integrity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Event Domains</h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">Explore by Category</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse specialized campus activities curated for all student departments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                to={`/events?category=${cat.key}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${cat.bgLight} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Browse Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Happening Soon</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Upcoming Events</p>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading upcoming events..." />
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No events currently scheduled.</p>
          </div>
        )}
      </section>

      {/* Full-Stack Architecture Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900/50">
          <div className="max-w-3xl space-y-4">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">
              Engineering Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built with Production Spring Boot & React Standards
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Designed following industry layered architecture with complete separation of concerns, DTO request validation, BCrypt hashed passwords, transactional capacity controls, and relational integrity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <ShieldCheck className="w-6 h-6 text-indigo-400 mb-2" />
                <h4 className="font-bold text-sm text-white">Security & Auth</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Spring Security 6 stateless JWT bearer tokens with role-based method authorization.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <Zap className="w-6 h-6 text-amber-400 mb-2" />
                <h4 className="font-bold text-sm text-white">JE Registration Engine</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Prevents duplicate bookings, validates capacity, deadlines, and handles cancellation.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <Users className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm text-white">Faculty Analytics</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Live occupancy statistics, student rosters, and multi-domain event lifecycle control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
