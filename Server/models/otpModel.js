import pool from '../config/db.js';

export const createOtp = async ({ userId, otpHash, expiresAt }) => {
  const [result] = await pool.query(
    `INSERT INTO email_otps (user_id, otp_hash, expires_at) VALUES (?, ?, ?)`,
    [userId, otpHash, expiresAt]
  );
  return result.insertId;
};

// Gets the most recent, still-valid (unconsumed, unexpired) OTP for a user.
// Used both to verify a submitted code and to check attempt count.
export const findActiveOtpByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT * FROM email_otps
     WHERE user_id = ? AND consumed_at IS NULL AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

export const incrementOtpAttempts = async (otpId) => {
  await pool.query('UPDATE email_otps SET attempts = attempts + 1 WHERE id = ?', [otpId]);
};

export const markOtpConsumed = async (otpId) => {
  await pool.query('UPDATE email_otps SET consumed_at = NOW() WHERE id = ?', [otpId]);
};

// Invalidates any still-active OTPs for a user — used right before issuing
// a new one, so only the most recently sent code can ever be valid.
export const invalidateActiveOtps = async (userId) => {
  await pool.query(
    `UPDATE email_otps SET consumed_at = NOW()
     WHERE user_id = ? AND consumed_at IS NULL`,
    [userId]
  );
};

// Counts how many OTPs have been sent to this user within a rolling window
// (e.g. the last 15 minutes), for enforcing the resend rate limit.
export const countRecentOtps = async (userId, windowMinutes) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM email_otps
     WHERE user_id = ? AND created_at > (NOW() - INTERVAL ? MINUTE)`,
    [userId, windowMinutes]
  );
  return rows[0].count;
};

// Returns the timestamp of the most recently sent OTP, used to enforce a
// short cooldown between individual resend requests (separate from the
// broader per-window cap above).
export const getLastOtpSentAt = async (userId) => {
  const [rows] = await pool.query(
    `SELECT created_at FROM email_otps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return rows[0]?.created_at || null;
};