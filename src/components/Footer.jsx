import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Database, Github, Code, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Campus<span className="text-indigo-400">Events</span> System
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A full-stack, enterprise-grade event management and registration portal for students and faculty. Designed with Spring Boot REST APIs, Spring Security, JWT authentication, and MySQL relational integrity.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                <Code className="w-3 h-3" /> Spring Boot 3.2
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-cyan-300 border border-slate-700">
                <Database className="w-3 h-3" /> MySQL 8
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-emerald-300 border border-slate-700">
                <Shield className="w-3 h-3" /> JWT & BCrypt
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Portal Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="hover:text-white transition">Upcoming Events</Link>
              </li>
              <li>
                <Link to="/events?category=TECHNICAL" className="hover:text-white transition">Technical Hackathons</Link>
              </li>
              <li>
                <Link to="/events?category=CULTURAL" className="hover:text-white transition">Cultural Fests</Link>
              </li>
              <li>
                <Link to="/events?category=SPORTS" className="hover:text-white transition">Sports Tournaments</Link>
              </li>
              <li>
                <Link to="/database" className="hover:text-white transition">MySQL Schema & DDL</Link>
              </li>
            </ul>
          </div>

          {/* Module Divisions */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Modular Architecture</h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-indigo-400 font-semibold">JB:</span> Database & Setup
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-indigo-400 font-semibold">JC:</span> Auth & Security
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-indigo-400 font-semibold">JD:</span> Event Browsing
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-indigo-400 font-semibold">JE:</span> Event Registration
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-indigo-400 font-semibold">JF:</span> Student Dashboard
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-indigo-400 font-semibold">JG:</span> Faculty Management
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-indigo-400 font-semibold">JH:</span> Roster & Testing
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Campus Event Management System. Built for college campus operations.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> REST APIs & Persistence Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
