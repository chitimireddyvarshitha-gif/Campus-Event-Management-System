import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'campus_event_mgmt_super_secret_jwt_key_2026';
const DB_FILE = path.join(__dirname, 'database', 'campus_event_management.json');

// Types matching JPA Entities
export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';
export type EventCategory = 'TECHNICAL' | 'CULTURAL' | 'SPORTS' | 'ACADEMIC' | 'OTHER';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type RegistrationStatus = 'REGISTERED' | 'CANCELLED';

export interface UserEntity {
  id: number;
  name: string;
  email: string;
  password: string; // BCrypt hash
  role: UserRole;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventEntity {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
  venue: string;
  organizer: string;
  capacity: number;
  registrationDeadline: string; // ISO or YYYY-MM-DDTHH:mm
  imageUrl: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationEntity {
  id: number;
  studentId: number;
  eventId: number;
  registrationDate: string;
  status: RegistrationStatus;
}

interface DatabaseSchema {
  users: UserEntity[];
  events: EventEntity[];
  registrations: RegistrationEntity[];
}

// Initial Sample Data pre-seeded with BCrypt hashes
function createInitialDatabase(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const studentHash = bcrypt.hashSync('Password123!', salt);
  const facultyHash = bcrypt.hashSync('Faculty123!', salt);
  const adminHash = bcrypt.hashSync('Admin123!', salt);

  const now = new Date().toISOString();

  return {
    users: [
      {
        id: 1,
        name: 'Alex Rivera',
        email: 'student1@college.edu',
        password: studentHash,
        role: 'STUDENT',
        phone: '555-0101',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'student2@college.edu',
        password: studentHash,
        role: 'STUDENT',
        phone: '555-0102',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: 'Dr. Robert Chen',
        email: 'faculty@college.edu',
        password: facultyHash,
        role: 'FACULTY',
        phone: '555-0103',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: 'Prof. Eleanor Vance',
        email: 'admin@college.edu',
        password: adminHash,
        role: 'ADMIN',
        phone: '555-0104',
        createdAt: now,
        updatedAt: now,
      },
    ],
    events: [
      {
        id: 1,
        title: 'HackCampus 2026: 24-Hour AI & Web Hackathon',
        description: 'Join 200+ top college innovators to build AI-powered solutions, web apps, and system prototypes. Mentorship from industry engineers, prizes up to $5,000, and free food/swag!',
        category: 'TECHNICAL',
        eventDate: '2026-10-15',
        eventTime: '09:00',
        venue: 'Computer Science Main Auditorium & Labs',
        organizer: 'Department of Computer Science & ACM Student Chapter',
        capacity: 120,
        registrationDeadline: '2026-10-12T23:59:00',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title: 'Spring Rhythm: Annual Inter-College Music & Dance Fest',
        description: 'The premier cultural event of the semester! Featuring solo acoustic battles, battle of the bands, classical fusion, street dance showdowns, and live celebrity band performances.',
        category: 'CULTURAL',
        eventDate: '2026-10-22',
        eventTime: '17:30',
        venue: 'Campus Open Air Amphitheater',
        organizer: 'Student Cultural Affairs Council',
        capacity: 350,
        registrationDeadline: '2026-10-20T18:00:00',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        title: 'Inter-Department Cricket & Football Championship',
        description: 'Annual sports week kick-off tournament. 8 engineering departments battling for the prestigious Provost Champions Trophy. Referees certified by State Sports Federation.',
        category: 'SPORTS',
        eventDate: '2026-11-02',
        eventTime: '08:00',
        venue: 'Varsity Sports Complex & Grounds',
        organizer: 'Athletics & Physical Education Board',
        capacity: 80,
        registrationDeadline: '2026-10-28T20:00:00',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        title: 'International Symposium on Quantum & Cloud Computing',
        description: 'Distinguished keynotes from research scientists at Google, IBM, and CERN. Hands-on afternoon workshops covering Qiskit quantum algorithms and cloud container orchestration.',
        category: 'ACADEMIC',
        eventDate: '2026-11-10',
        eventTime: '10:00',
        venue: 'Research Center Conference Hall A',
        organizer: 'Dean of Academic Research & IEEE Branch',
        capacity: 150,
        registrationDeadline: '2026-11-05T23:59:00',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        title: 'RoboWars: Autonomous & RC Combat Robotics',
        description: 'High-voltage combat robotics in 15kg and 30kg battlebot categories. Includes obstacle avoidance autonomous racing and maze navigation competitions.',
        category: 'TECHNICAL',
        eventDate: '2026-11-18',
        eventTime: '11:00',
        venue: 'Mechanical Engineering Workshop Arena',
        organizer: 'Robotics and Mechatronics Club',
        capacity: 90,
        registrationDeadline: '2026-11-14T22:00:00',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        title: 'Campus Career & Tech Internship Expo 2026',
        description: 'Connect directly with hiring managers and recruiters from 45+ premier companies looking for summer interns, co-ops, and full-time junior software engineers.',
        category: 'ACADEMIC',
        eventDate: '2026-12-01',
        eventTime: '09:30',
        venue: 'Grand Convention Center Hall 1 & 2',
        organizer: 'University Career Placement Services',
        capacity: 300,
        registrationDeadline: '2026-11-25T23:59:00',
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        createdAt: now,
        updatedAt: now,
      },
    ],
    registrations: [
      {
        id: 1,
        studentId: 1,
        eventId: 1,
        registrationDate: '2026-09-20T14:32:00.000Z',
        status: 'REGISTERED',
      },
      {
        id: 2,
        studentId: 1,
        eventId: 5,
        registrationDate: '2026-09-21T16:15:00.000Z',
        status: 'REGISTERED',
      },
      {
        id: 3,
        studentId: 2,
        eventId: 2,
        registrationDate: '2026-09-22T10:45:00.000Z',
        status: 'REGISTERED',
      },
      {
        id: 4,
        studentId: 2,
        eventId: 1,
        registrationDate: '2026-09-23T11:20:00.000Z',
        status: 'REGISTERED',
      },
    ],
  };
}

// Load or initialize DB
function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading DB file, re-initializing:', err);
  }
  const init = createInitialDatabase();
  saveDb(init);
  return init;
}

function saveDb(db: DatabaseSchema) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

let db = loadDb();

// JWT Payload interface
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Authentication Middlewares
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Full authentication is required to access this resource',
      status: 401,
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
        status: 401,
      });
    }
    req.user = decoded as AuthUser;
    next();
  });
}

function optionalToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        req.user = decoded as AuthUser;
      }
      next();
    });
  } else {
    next();
  }
}

function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        status: 401,
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of roles: [${roles.join(', ')}]`,
        status: 403,
      });
    }
    next();
  };
}

// Helper to format event response with dynamic capacity and status
function formatEventResponse(event: EventEntity, currentUserId?: number) {
  const activeRegistrations = db.registrations.filter(
    (r) => r.eventId === event.id && r.status === 'REGISTERED'
  );
  const registeredCount = activeRegistrations.length;
  const availableSeats = Math.max(0, event.capacity - registeredCount);

  let isRegistered = false;
  let userRegistrationId: number | null = null;

  if (currentUserId) {
    const userReg = activeRegistrations.find((r) => r.studentId === currentUserId);
    if (userReg) {
      isRegistered = true;
      userRegistrationId = userReg.id;
    }
  }

  return {
    ...event,
    registeredCount,
    availableSeats,
    isRegistered,
    userRegistrationId,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --------------------------------------------------------------------------
  // API Routes
  // --------------------------------------------------------------------------

  // 1. AUTHENTICATION CONTROLLER

  // POST /api/auth/register
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, phone',
        status: 400,
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = db.users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        status: 409,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        status: 400,
      });
    }

    const validRole: UserRole = role === 'ADMIN' ? 'ADMIN' : role === 'FACULTY' ? 'FACULTY' : 'STUDENT';
    const hashedPassword = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();
    const newId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;

    const newUser: UserEntity = {
      id: newId,
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      role: validRole,
      phone: phone.trim(),
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);
    saveDb(db);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully! You can now log in.',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
    });
  });

  // POST /api/auth/login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        status: 400,
      });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        status: 401,
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        status: 401,
      });
    }

    const payload: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        type: 'Bearer',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
    });
  });

  // GET /api/auth/me
  app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
    const user = db.users.find((u) => u.id === req.user!.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        status: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Current user profile retrieved',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  });

  // 2. EVENTS CONTROLLER

  // GET /api/events
  app.get('/api/events', optionalToken, (req: Request, res: Response) => {
    let results = [...db.events];
    const { search, category, status, date } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      results = results.filter((e) => e.category === category);
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      results = results.filter((e) => e.status === status);
    }

    if (date && typeof date === 'string') {
      results = results.filter((e) => e.eventDate >= date);
    }

    // Sort by eventDate ascending
    results.sort((a, b) => (a.eventDate > b.eventDate ? 1 : -1));

    const formatted = results.map((e) => formatEventResponse(e, req.user?.id));

    return res.status(200).json({
      success: true,
      message: 'Events fetched successfully',
      data: formatted,
    });
  });

  // GET /api/events/:id
  app.get('/api/events/:id', optionalToken, (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id, 10);
    const event = db.events.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        status: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event details fetched successfully',
      data: formatEventResponse(event, req.user?.id),
    });
  });

  // POST /api/events (Faculty or Admin only)
  app.post('/api/events', authenticateToken, requireRole('FACULTY', 'ADMIN'), (req: Request, res: Response) => {
    const {
      title,
      description,
      category,
      eventDate,
      eventTime,
      venue,
      organizer,
      capacity,
      registrationDeadline,
      imageUrl,
      status,
    } = req.body;

    if (!title || !description || !category || !eventDate || !eventTime || !venue || !organizer || !capacity || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'All event details including title, category, date, time, venue, organizer, capacity, and deadline are required.',
        status: 400,
      });
    }

    if (parseInt(capacity, 10) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Event capacity must be greater than 0',
        status: 400,
      });
    }

    const now = new Date().toISOString();
    const newId = db.events.length > 0 ? Math.max(...db.events.map((e) => e.id)) + 1 : 1;

    const newEvent: EventEntity = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      category: category as EventCategory,
      eventDate,
      eventTime,
      venue: venue.trim(),
      organizer: organizer.trim(),
      capacity: parseInt(capacity, 10),
      registrationDeadline,
      imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      status: (status as EventStatus) || 'UPCOMING',
      createdAt: now,
      updatedAt: now,
    };

    db.events.push(newEvent);
    saveDb(db);

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: formatEventResponse(newEvent),
    });
  });

  // PUT /api/events/:id (Faculty or Admin only)
  app.put('/api/events/:id', authenticateToken, requireRole('FACULTY', 'ADMIN'), (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id, 10);
    const index = db.events.findIndex((e) => e.id === eventId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        status: 404,
      });
    }

    const current = db.events[index];
    const {
      title,
      description,
      category,
      eventDate,
      eventTime,
      venue,
      organizer,
      capacity,
      registrationDeadline,
      imageUrl,
      status,
    } = req.body;

    const updated: EventEntity = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      description: description !== undefined ? description.trim() : current.description,
      category: category || current.category,
      eventDate: eventDate || current.eventDate,
      eventTime: eventTime || current.eventTime,
      venue: venue !== undefined ? venue.trim() : current.venue,
      organizer: organizer !== undefined ? organizer.trim() : current.organizer,
      capacity: capacity !== undefined ? parseInt(capacity, 10) : current.capacity,
      registrationDeadline: registrationDeadline || current.registrationDeadline,
      imageUrl: imageUrl !== undefined ? imageUrl.trim() : current.imageUrl,
      status: status || current.status,
      updatedAt: new Date().toISOString(),
    };

    db.events[index] = updated;
    saveDb(db);

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: formatEventResponse(updated),
    });
  });

  // DELETE /api/events/:id (Faculty or Admin only)
  app.delete('/api/events/:id', authenticateToken, requireRole('FACULTY', 'ADMIN'), (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id, 10);
    const index = db.events.findIndex((e) => e.id === eventId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        status: 404,
      });
    }

    db.events.splice(index, 1);
    // Cascade delete or cancel registrations
    db.registrations = db.registrations.filter((r) => r.eventId !== eventId);
    saveDb(db);

    return res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
      data: null,
    });
  });

  // 3. STUDENT REGISTRATION CONTROLLER (JE Module)

  // POST /api/events/:eventId/register
  app.post('/api/events/:eventId/register', authenticateToken, requireRole('STUDENT'), (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const eventId = parseInt(req.params.eventId, 10);

    // Rule 1: Student authenticated (handled by authenticateToken & requireRole)

    // Rule 2: Verify that the event exists
    const event = db.events.find((e) => e.id === eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        status: 404,
      });
    }

    // Rule 3: Verify that the event is not cancelled
    if (event.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Event has been cancelled. Registrations are not allowed.',
        status: 400,
      });
    }

    // Rule 4: Verify that the registration deadline has not passed
    const now = new Date();
    const deadline = new Date(event.registrationDeadline);
    if (now.getTime() > deadline.getTime()) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
        status: 400,
      });
    }

    // Rule 5: Count current active registrations
    const activeRegistrations = db.registrations.filter(
      (r) => r.eventId === eventId && r.status === 'REGISTERED'
    );

    // Rule 6: Verify that capacity has not been reached
    if (activeRegistrations.length >= event.capacity) {
      return res.status(409).json({
        success: false,
        message: 'Event is full. Capacity has been reached.',
        status: 409,
      });
    }

    // Rule 7: Check whether the student has already registered
    const existingRegistration = db.registrations.find(
      (r) => r.eventId === eventId && r.studentId === studentId
    );

    if (existingRegistration && existingRegistration.status === 'REGISTERED') {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event',
        status: 409,
      });
    }

    let registrationRecord: RegistrationEntity;

    if (existingRegistration && existingRegistration.status === 'CANCELLED') {
      // Reactivate cancelled registration
      existingRegistration.status = 'REGISTERED';
      existingRegistration.registrationDate = new Date().toISOString();
      registrationRecord = existingRegistration;
    } else {
      // Create new registration
      const newRegId = db.registrations.length > 0 ? Math.max(...db.registrations.map((r) => r.id)) + 1 : 1;
      registrationRecord = {
        id: newRegId,
        studentId,
        eventId,
        registrationDate: new Date().toISOString(),
        status: 'REGISTERED',
      };
      db.registrations.push(registrationRecord);
    }

    saveDb(db);

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for the event!',
      data: {
        registrationId: registrationRecord.id,
        eventId: event.id,
        eventTitle: event.title,
        registrationDate: registrationRecord.registrationDate,
        status: registrationRecord.status,
      },
    });
  });

  // GET /api/students/:studentId/registrations
  app.get('/api/students/:studentId/registrations', authenticateToken, (req: Request, res: Response) => {
    const studentId = parseInt(req.params.studentId, 10);

    // Only allow student to view their own registrations, unless admin/faculty
    if (req.user!.role === 'STUDENT' && req.user!.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to other student registration records',
        status: 403,
      });
    }

    const studentRegs = db.registrations.filter((r) => r.studentId === studentId);

    // Map with joined event data
    const detailed = studentRegs.map((r) => {
      const event = db.events.find((e) => e.id === r.eventId);
      return {
        id: r.id,
        studentId: r.studentId,
        eventId: r.eventId,
        registrationDate: r.registrationDate,
        status: r.status,
        event: event
          ? {
              id: event.id,
              title: event.title,
              category: event.category,
              eventDate: event.eventDate,
              eventTime: event.eventTime,
              venue: event.venue,
              organizer: event.organizer,
              status: event.status,
              imageUrl: event.imageUrl,
            }
          : null,
      };
    });

    // Sort by registrationDate descending
    detailed.sort((a, b) => (a.registrationDate < b.registrationDate ? 1 : -1));

    return res.status(200).json({
      success: true,
      message: 'Student registrations fetched successfully',
      data: detailed,
    });
  });

  // DELETE /api/registrations/:registrationId (Cancellation)
  app.delete('/api/registrations/:registrationId', authenticateToken, (req: Request, res: Response) => {
    const regId = parseInt(req.params.registrationId, 10);
    const registration = db.registrations.find((r) => r.id === regId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
        status: 404,
      });
    }

    // Must belong to logged in student or be admin
    if (req.user!.role === 'STUDENT' && registration.studentId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own registrations',
        status: 403,
      });
    }

    if (registration.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled',
        status: 400,
      });
    }

    // Change status to CANCELLED (does not delete record to maintain audit, but seat is freed)
    registration.status = 'CANCELLED';
    saveDb(db);

    return res.status(200).json({
      success: true,
      message: 'Registration successfully cancelled',
      data: {
        registrationId: registration.id,
        status: registration.status,
      },
    });
  });

  // 4. FACULTY / ADMIN DASHBOARD & MANAGEMENT

  // GET /api/admin/events
  app.get('/api/admin/events', authenticateToken, requireRole('FACULTY', 'ADMIN'), (req: Request, res: Response) => {
    const list = db.events.map((e) => {
      const eventRegs = db.registrations.filter((r) => r.eventId === e.id);
      const activeRegs = eventRegs.filter((r) => r.status === 'REGISTERED');
      const cancelledRegs = eventRegs.filter((r) => r.status === 'CANCELLED');

      return {
        ...e,
        activeRegistrations: activeRegs.length,
        cancelledRegistrations: cancelledRegs.length,
        totalRegistrations: eventRegs.length,
        availableSeats: Math.max(0, e.capacity - activeRegs.length),
        occupancyRate: Math.min(100, Math.round((activeRegs.length / e.capacity) * 100)),
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Admin events fetched successfully',
      data: list,
    });
  });

  // GET /api/events/:eventId/registrations
  app.get('/api/events/:eventId/registrations', authenticateToken, requireRole('FACULTY', 'ADMIN'), (req: Request, res: Response) => {
    const eventId = parseInt(req.params.eventId, 10);
    const event = db.events.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        status: 404,
      });
    }

    const eventRegs = db.registrations.filter((r) => r.eventId === eventId);

    const studentList = eventRegs.map((r) => {
      const student = db.users.find((u) => u.id === r.studentId);
      return {
        registrationId: r.id,
        studentId: r.studentId,
        studentName: student?.name || 'Unknown Student',
        studentEmail: student?.email || 'N/A',
        studentPhone: student?.phone || 'N/A',
        registrationDate: r.registrationDate,
        status: r.status,
      };
    });

    const activeCount = studentList.filter((s) => s.status === 'REGISTERED').length;

    return res.status(200).json({
      success: true,
      message: 'Event registrations fetched successfully',
      data: {
        event: {
          id: event.id,
          title: event.title,
          capacity: event.capacity,
          totalRegistered: activeCount,
          availableSeats: Math.max(0, event.capacity - activeCount),
        },
        registrations: studentList,
      },
    });
  });

  // GET /api/admin/dashboard
  app.get('/api/admin/dashboard', authenticateToken, requireRole('FACULTY', 'ADMIN'), (req: Request, res: Response) => {
    const totalEvents = db.events.length;
    const upcomingEvents = db.events.filter((e) => e.status === 'UPCOMING').length;
    const completedEvents = db.events.filter((e) => e.status === 'COMPLETED').length;
    const cancelledEvents = db.events.filter((e) => e.status === 'CANCELLED').length;

    const totalRegistrations = db.registrations.length;
    const activeRegistrations = db.registrations.filter((r) => r.status === 'REGISTERED').length;
    const cancelledRegistrations = db.registrations.filter((r) => r.status === 'CANCELLED').length;

    const categoryBreakdown: Record<string, number> = {};
    for (const e of db.events) {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + 1;
    }

    // Recent registrations with student & event names
    const recent = [...db.registrations]
      .sort((a, b) => (a.registrationDate < b.registrationDate ? 1 : -1))
      .slice(0, 10)
      .map((r) => {
        const student = db.users.find((u) => u.id === r.studentId);
        const event = db.events.find((e) => e.id === r.eventId);
        return {
          id: r.id,
          studentName: student?.name || 'Student #' + r.studentId,
          studentEmail: student?.email,
          eventTitle: event?.title || 'Event #' + r.eventId,
          eventCategory: event?.category,
          registrationDate: r.registrationDate,
          status: r.status,
        };
      });

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard statistics fetched successfully',
      data: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        cancelledEvents,
        totalRegistrations,
        activeRegistrations,
        cancelledRegistrations,
        categoryBreakdown,
        recentRegistrations: recent,
      },
    });
  });

  // POST /api/seed/reset (Utility to restore clean sample data)
  app.post('/api/seed/reset', (req: Request, res: Response) => {
    db = createInitialDatabase();
    saveDb(db);
    return res.status(200).json({
      success: true,
      message: 'Database reset to initial sample state successfully',
      data: {
        userCount: db.users.length,
        eventCount: db.events.length,
        registrationCount: db.registrations.length,
      },
    });
  });

  // GET /api/db/export (Utility to view live database records and schema)
  app.get('/api/db/export', (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      data: {
        users: db.users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone,
          createdAt: u.createdAt,
        })),
        events: db.events,
        registrations: db.registrations,
      },
    });
  });

  // Mount Vite middlewares in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
