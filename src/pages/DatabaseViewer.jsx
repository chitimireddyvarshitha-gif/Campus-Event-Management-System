import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Database, Table, Code, RefreshCw, RotateCcw, Check, Copy } from 'lucide-react';

export const DatabaseViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('live_tables');
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState('');

  const fetchExport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await eventService.getDatabaseExport();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load database export');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExport();
  }, []);

  const handleReset = async () => {
    if (!window.confirm('Reset database to clean initial sample state?')) return;
    try {
      setResetting(true);
      await eventService.resetDatabase();
      setResetNotice('Database reset to initial sample state successfully!');
      setTimeout(() => setResetNotice(''), 3000);
      await fetchExport();
    } catch (err) {
      setError('Failed to reset database');
    } finally {
      setResetting(false);
    }
  };

  const schemaSql = `-- ==========================================================
-- Campus Event Management System - MySQL Database Schema
-- Database Name: campus_event_management
-- ==========================================================

DROP DATABASE IF EXISTS campus_event_management;
CREATE DATABASE campus_event_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_event_management;

-- Table: users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'FACULTY', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- Table: events
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('TECHNICAL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'OTHER') NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(10) NOT NULL,
    venue VARCHAR(200) NOT NULL,
    organizer VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    registration_deadline DATETIME NOT NULL,
    image_url VARCHAR(500),
    status ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_event_category (category),
    INDEX idx_event_status (status)
) ENGINE=InnoDB;

-- Table: registrations
CREATE TABLE registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('REGISTERED', 'CANCELLED') NOT NULL DEFAULT 'REGISTERED',
    CONSTRAINT fk_registration_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT uq_student_event UNIQUE (student_id, event_id),
    INDEX idx_reg_student (student_id),
    INDEX idx_reg_event (event_id),
    INDEX idx_reg_status (status)
) ENGINE=InnoDB;`;

  const copySql = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" /> MySQL Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Database & Schema Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore MySQL relational tables, schema DDL, constraints, and live persisted data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchExport}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchExport} />

      {resetNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{resetNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('live_tables')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'live_tables'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Live Relational Tables</span>
        </button>

        <button
          onClick={() => setActiveTab('schema_sql')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'schema_sql'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>MySQL DDL (schema.sql)</span>
        </button>
      </div>

      {loading ? (
        <Loading text="Loading database tables and schema..." />
      ) : activeTab === 'live_tables' && data ? (
        <div className="space-y-8">
          {/* USERS TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-mono">TABLE: users</h3>
                <p className="text-[11px] text-slate-500">
                  Roles: STUDENT, FACULTY, ADMIN • Passwords hashed with BCrypt
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {data.users?.length || 0} Records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/60 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">name</th>
                    <th className="px-4 py-3">email</th>
                    <th className="px-4 py-3">role</th>
                    <th className="px-4 py-3">phone</th>
                    <th className="px-4 py-3">created_at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.users?.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">{u.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200/70 text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.phone}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EVENTS TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-mono">TABLE: events</h3>
                <p className="text-[11px] text-slate-500">
                  Categories: TECHNICAL, CULTURAL, SPORTS, ACADEMIC, OTHER
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {data.events?.length || 0} Records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/60 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">title</th>
                    <th className="px-4 py-3">category</th>
                    <th className="px-4 py-3">event_date</th>
                    <th className="px-4 py-3">venue</th>
                    <th className="px-4 py-3">capacity</th>
                    <th className="px-4 py-3">status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.events?.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">{e.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 max-w-xs truncate">{e.title}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200/70 text-slate-700">
                          {e.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{e.eventDate} ({e.eventTime})</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate">{e.venue}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{e.capacity}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* REGISTRATIONS TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-mono">TABLE: registrations</h3>
                <p className="text-[11px] text-slate-500">
                  Foreign Keys: student_id → users(id), event_id → events(id) • Unique Constraint (student_id, event_id)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {data.registrations?.length || 0} Records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/60 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">student_id (FK)</th>
                    <th className="px-4 py-3">event_id (FK)</th>
                    <th className="px-4 py-3">registration_date</th>
                    <th className="px-4 py-3">status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.registrations?.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">{r.id}</td>
                      <td className="px-4 py-3 font-mono text-slate-800">Student #{r.studentId}</td>
                      <td className="px-4 py-3 font-mono text-slate-800">Event #{r.eventId}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(r.registrationDate).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            r.status === 'REGISTERED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-slate-900 rounded-3xl p-6 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
          <button
            onClick={copySql}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition cursor-pointer text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
          </button>
          <pre className="text-slate-300 leading-relaxed font-mono whitespace-pre">{schemaSql}</pre>
        </div>
      )}
    </div>
  );
};

export default DatabaseViewer;
