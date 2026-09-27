-- ==========================================================
-- Campus Event Management System - Sample Data
-- Database Name: campus_event_management
-- Pre-hashed with BCrypt (10 rounds):
-- Password123! for Students
-- Faculty123! for Faculty
-- Admin123! for Admin
-- ==========================================================

USE campus_event_management;

-- ----------------------------------------------------------
-- Sample Users
-- 2 Students, 1 Faculty, 1 Admin
-- ----------------------------------------------------------
INSERT INTO users (id, name, email, password, role, phone, created_at, updated_at) VALUES
(1, 'Alex Rivera', 'student1@college.edu', '$2a$10$K9aHh6i8PvxqP15d8623rOX/o0P6e612O3s12Ncmf.xK9b1sZ2t.W', 'STUDENT', '555-0101', NOW(), NOW()),
(2, 'Priya Sharma', 'student2@college.edu', '$2a$10$K9aHh6i8PvxqP15d8623rOX/o0P6e612O3s12Ncmf.xK9b1sZ2t.W', 'STUDENT', '555-0102', NOW(), NOW()),
(3, 'Dr. Robert Chen', 'faculty@college.edu', '$2a$10$wN1r78tK86yU0qGfL/9g1Oz1vGZJ6m5b7hU4vB8yO9K8N6l5m4j3a', 'FACULTY', '555-0103', NOW(), NOW()),
(4, 'Prof. Eleanor Vance', 'admin@college.edu', '$2a$10$p0r9S8t7u6v5w4x3y2z10Ou1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j', 'ADMIN', '555-0104', NOW(), NOW());

-- ----------------------------------------------------------
-- Sample Events (5+ events across Technical, Cultural, Sports, Academic)
-- ----------------------------------------------------------
INSERT INTO events (id, title, description, category, event_date, event_time, venue, organizer, capacity, registration_deadline, image_url, status, created_at, updated_at) VALUES
(1, 'HackCampus 2026: 24-Hour AI & Web Hackathon', 'Join 200+ top college innovators to build AI-powered solutions, web apps, and system prototypes. Mentorship from industry engineers, prizes up to $5,000, and free food/swag!', 'TECHNICAL', '2026-10-15', '09:00', 'Computer Science Main Auditorium & Labs', 'Department of Computer Science & ACM Student Chapter', 120, '2026-10-12 23:59:00', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80', 'UPCOMING', NOW(), NOW()),
(2, 'Spring Rhythm: Annual Inter-College Music & Dance Fest', 'The premier cultural event of the semester! Featuring solo acoustic battles, battle of the bands, classical fusion, street dance showdowns, and live celebrity band performances.', 'CULTURAL', '2026-10-22', '17:30', 'Campus Open Air Amphitheater', 'Student Cultural Affairs Council', 350, '2026-10-20 18:00:00', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80', 'UPCOMING', NOW(), NOW()),
(3, 'Inter-Department Cricket & Football Championship', 'Annual sports week kick-off tournament. 8 engineering departments battling for the prestigious Provost Champions Trophy. Referees certified by State Sports Federation.', 'SPORTS', '2026-11-02', '08:00', 'Varsity Sports Complex & Grounds', 'Athletics & Physical Education Board', 80, '2026-10-28 20:00:00', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', 'UPCOMING', NOW(), NOW()),
(4, 'International Symposium on Quantum & Cloud Computing', 'Distinguished keynotes from research scientists at Google, IBM, and CERN. Hands-on afternoon workshops covering Qiskit quantum algorithms and cloud container orchestration.', 'ACADEMIC', '2026-11-10', '10:00', 'Research Center Conference Hall A', 'Dean of Academic Research & IEEE Branch', 150, '2026-11-05 23:59:00', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', 'UPCOMING', NOW(), NOW()),
(5, 'RoboWars: Autonomous & RC Combat Robotics', 'High-voltage combat robotics in 15kg and 30kg battlebot categories. Includes obstacle avoidance autonomous racing and maze navigation competitions.', 'TECHNICAL', '2026-11-18', '11:00', 'Mechanical Engineering Workshop Arena', 'Robotics and Mechatronics Club', 90, '2026-11-14 22:00:00', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80', 'UPCOMING', NOW(), NOW()),
(6, 'Campus Career & Tech Internship Expo 2026', 'Connect directly with hiring managers and recruiters from 45+ premier companies looking for summer interns, co-ops, and full-time junior software engineers.', 'ACADEMIC', '2026-12-01', '09:30', 'Grand Convention Center Hall 1 & 2', 'University Career Placement Services', 300, '2026-11-25 23:59:00', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80', 'UPCOMING', NOW(), NOW());

-- ----------------------------------------------------------
-- Sample Registrations
-- Alex Rivera registered for HackCampus (1) and RoboWars (5)
-- Priya Sharma registered for Spring Rhythm (2) and HackCampus (1)
-- ----------------------------------------------------------
INSERT INTO registrations (id, student_id, event_id, registration_date, status) VALUES
(1, 1, 1, '2026-09-20 14:32:00', 'REGISTERED'),
(2, 1, 5, '2026-09-21 16:15:00', 'REGISTERED'),
(3, 2, 2, '2026-09-22 10:45:00', 'REGISTERED'),
(4, 2, 1, '2026-09-23 11:20:00', 'REGISTERED');
