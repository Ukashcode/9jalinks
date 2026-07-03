-- 9jaLinks Sprint 1 Schema
-- Run this once against your MySQL database to create the initial tables.

-- Note: identifiers starting with a digit must be backtick-quoted in MySQL.
CREATE DATABASE IF NOT EXISTS `9jalinks`;
USE `9jalinks`;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  verification_status ENUM('unverified', 'pending', 'verified') NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_username (username)
);