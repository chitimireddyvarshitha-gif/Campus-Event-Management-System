# Campus Event Management System

A full-stack, production-quality college event management and registration web application designed for students and faculty.

---

## 1. Project Overview

Colleges conduct technical, cultural, sports, and academic events throughout the academic year. Traditionally, event information, student registrations, and participation records are maintained manually across spreadsheets and noticeboards.

The **Campus Event Management System** automates this end-to-end workflow:
- **Students** can discover upcoming events, search and filter by category or date, check real-time seat availability, register with instant validation, manage their registrations, and cancel registrations safely.
- **Faculty and Administrators** can create, update, and manage events, monitor registration statistics, inspect student rosters for each event, view capacity utilization rates, and analyze metrics across technical, cultural, sports, and academic domains.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router
- **HTTP Client**: Axios with centralized JWT Bearer interceptor
- **Styling**: Modern responsive design using Tailwind CSS & Bootstrap 5 design principles
- **Icons & Animation**: Lucide React, Canvas Confetti

### Backend
- **Language**: Java 17+
- **Framework**: Spring Boot 3.2.3
- **Web**: Spring MVC / Spring Web REST APIs
- **ORM / Persistence**: Spring Data JPA & Hibernate
- **Security**: Spring Security 6 with stateless JWT (jjwt 0.11.5) and BCrypt password hashing
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@FutureOrPresent`, `@Min`)
- **Build Tool**: Apache Maven

### Database
- **Engine**: MySQL 8+
- **Database Name**: `campus_event_management`
- **Tables**: `users`, `events`, `registrations`

---

## 3. Architecture & Modular Structure

```
React Frontend (Vite)
      ↓ (Axios Interceptors with JWT Bearer Token)
REST API Controllers (Spring Boot)
      ↓
Service Layer (Business Logic & Transactions)
      ↓
Repository Layer (Spring Data JPA)
      ↓
Hibernate ORM
      ↓
MySQL Database (campus_event_management)
```

### Git-Friendly Feature Ownership & Modular Division
- **JB (Project Setup + Database)**: `database/schema.sql`, `database/sample-data.sql`, DB entity relationships, and configuration.
- **JC (Authentication + Security)**: `security/JwtUtils.java`, `AuthTokenFilter.java`, `SecurityConfig.java`, `AuthService.java`, `AuthController.java`.
- **JD (Student Event Browsing)**: `EventController.java`, `EventService.java`, `EventRepository.java`, `Events.jsx`, `EventDetails.jsx`.
- **JE (Event Registration Module)**: `RegistrationService.java`, `RegistrationController.java`, `RegistrationRepository.java`, capacity calculation, and deadline enforcement.
- **JF (Student Dashboard)**: `StudentDashboard.jsx`, `MyRegistrations.jsx`, cancellation workflows.
- **JG (Faculty Event Management)**: `ManageEvents.jsx`, `EventForm.jsx`, `AdminDashboard.jsx`, CRUD operations.
- **JH (Registered Students + Testing)**: `RegisteredStudents.jsx`, `RegistrationServiceTest.java`, Postman test suites.

---

## 4. Database Design

```
+---------------------------------------------------------+
|                         users                           |
+---------------------------------------------------------+
| id          | BIGINT AUTO_INCREMENT (PK)                |
| name        | VARCHAR(100) NOT NULL                     |
| email       | VARCHAR(150) NOT NULL UNIQUE              |
| password    | VARCHAR(255) NOT NULL (BCrypt Hash)       |
| role        | ENUM('STUDENT', 'FACULTY', 'ADMIN')       |
| phone       | VARCHAR(20) NOT NULL                      |
| created_at  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP       |
| updated_at  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP       |
+---------------------------------------------------------+
                          | 1
                          |
                          | N
+---------------------------------------------------------+
|                     registrations                       |
+---------------------------------------------------------+
| id                | BIGINT AUTO_INCREMENT (PK)          |
| student_id        | BIGINT NOT NULL (FK -> users.id)    |
| event_id          | BIGINT NOT NULL (FK -> events.id)   |
| registration_date | TIMESTAMP DEFAULT CURRENT_TIMESTAMP |
| status            | ENUM('REGISTERED', 'CANCELLED')     |
| CONSTRAINT uq_student_event UNIQUE (student_id, event_id)|
+---------------------------------------------------------+
                          | N
                          |
                          | 1
+---------------------------------------------------------+
|                        events                           |
+---------------------------------------------------------+
| id                    | BIGINT AUTO_INCREMENT (PK)      |
| title                 | VARCHAR(200) NOT NULL           |
| description           | TEXT NOT NULL                   |
| category              | ENUM('TECHNICAL', 'CULTURAL',   |
|                       |  'SPORTS', 'ACADEMIC', 'OTHER') |
| event_date            | DATE NOT NULL                   |
| event_time            | VARCHAR(10) NOT NULL            |
| venue                 | VARCHAR(200) NOT NULL           |
| organizer             | VARCHAR(150) NOT NULL           |
| capacity              | INT NOT NULL                    |
| registration_deadline | DATETIME NOT NULL               |
| image_url             | VARCHAR(500)                    |
| status                | ENUM('UPCOMING', 'ONGOING',     |
|                       |  'COMPLETED', 'CANCELLED')      |
| created_at            | TIMESTAMP DEFAULT CURRENT_TIMESTAMP
| updated_at            | TIMESTAMP DEFAULT CURRENT_TIMESTAMP
+---------------------------------------------------------+
```

---

## 5. Event Registration Business Rules (Module JE)

When a student initiates an event registration:
1. **Authentication Check**: Verifies valid JWT bearer token. Only students are permitted.
2. **Event Existence**: Verifies event ID exists in database (HTTP 404 if missing).
3. **Event Status Check**: Verifies event is not `CANCELLED` (HTTP 400 if cancelled).
4. **Deadline Verification**: Verifies `LocalDateTime.now()` is before `registrationDeadline` (HTTP 400 if passed).
5. **Capacity Calculation**: Counts active registrations (`status = 'REGISTERED'`).
6. **Seat Check**: Rejects registration if `activeRegistrations >= capacity` (HTTP 409 Conflict).
7. **Duplicate Prevention**: Queries database for existing registration between student and event. If already `REGISTERED`, rejects with HTTP 409 Conflict. If previously `CANCELLED`, reactivates record safely.
8. **Transactional Persistence**: Saves registration with current timestamp.
9. **Cancellation Rule**: When a student cancels, status transitions to `CANCELLED`. Cancelled registrations immediately release capacity and do not count toward event capacity.

---

## 6. Development Credentials

| Role | Name | Email | Password | Phone |
|---|---|---|---|---|
| **Student 1** | Alex Rivera | `student1@college.edu` | `Password123!` | 555-0101 |
| **Student 2** | Priya Sharma | `student2@college.edu` | `Password123!` | 555-0102 |
| **Faculty** | Dr. Robert Chen | `faculty@college.edu` | `Faculty123!` | 555-0103 |
| **Admin** | Prof. Eleanor Vance | `admin@college.edu` | `Admin123!` | 555-0104 |

*(A Quick Demo Login switcher is also embedded in the web interface for one-click testing.)*

---

## 7. REST API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Register student or faculty user
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Retrieve profile of authenticated user

### Event Endpoints
- `GET /api/events` — List events with filters (`search`, `category`, `status`, `date`)
- `GET /api/events/{id}` — Retrieve single event details with computed seats
- `POST /api/events` — Create new event *(Faculty/Admin only)*
- `PUT /api/events/{id}` — Update event details *(Faculty/Admin only)*
- `DELETE /api/events/{id}` — Delete or cancel event *(Faculty/Admin only)*

### Registration Endpoints
- `POST /api/events/{eventId}/register` — Register student for event *(Student only)*
- `GET /api/students/{studentId}/registrations` — View registered events for student
- `DELETE /api/registrations/{registrationId}` — Cancel student registration

### Faculty & Admin Endpoints
- `GET /api/admin/dashboard` — Metric counts, category breakdown, recent activity
- `GET /api/admin/events` — All events with active/cancelled registration counts
- `GET /api/events/{eventId}/registrations` — Student roster for a specific event

---

## 8. How to Run

### Spring Boot Backend Setup (Standalone)
1. Ensure MySQL is running on port 3306.
2. Execute `database/schema.sql` and `database/sample-data.sql` in MySQL Workbench or CLI:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/sample-data.sql
   ```
3. Navigate to `backend/`:
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
   The backend starts at `http://localhost:8080`.

### React Web Application
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Access the application at `http://localhost:3000`.

---

## 9. Backend Testing

Run the automated JUnit & Mockito unit tests for the registration module:
```bash
cd backend
mvn test
```
Tests cover:
- Successful registration
- Duplicate registration rejection
- Capacity overflow rejection
- Past deadline rejection
- Cancelled event rejection
- Invalid event ID handling
- Authorized cancellation and seat restoration
- Unauthorized cancellation rejection
