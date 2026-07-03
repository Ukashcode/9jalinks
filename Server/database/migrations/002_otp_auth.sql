-- 9jaLinks — Email OTP Authentication migration
-- Run this AFTER schema.sql. Adds email verification tracking to users,
-- and a dedicated table for OTP codes (hashed, never stored in plain text).

USE `9jalinks`;

-- Accounts start unverified until the user confirms their email via OTP.
-- This is separate from `verification_status`, which tracks seller/badge
-- verification — email_verified only gates login access.
ALTER TABLE users
  ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE AFTER verification_status;

CREATE TABLE IF NOT EXISTS email_otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  consumed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_email_otps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at)
);