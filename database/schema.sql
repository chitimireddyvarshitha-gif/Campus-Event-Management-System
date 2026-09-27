-- ==========================================================
-- Campus Event Management System - MySQL Database Schema
-- Database Name: campus_event_management
-- ==========================================================

DROP DATABASE IF EXISTS campus_event_management;
CREATE DATABASE campus_event_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_event_management;

-- ----------------------------------------------------------
-- Table: users
-- Roles: STUDENT, FACULTY, ADMIN
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- Table: events
-- Categories: TECHNICAL, CULTURAL, SPORTS, ACADEMIC, OTHER
-- Statuses: UPCOMING, ONGOING, COMPLETED, CANCELLED
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- Table: registrations
-- Statuses: REGISTERED, CANCELLED
-- Unique constraint prevents duplicate registrations
-- ----------------------------------------------------------
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
) ENGINE=InnoDB;
