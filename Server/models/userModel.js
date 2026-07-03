import pool from '../config/db.js';

// Each function here maps directly to one job on the `users` table.
// Controllers should never write raw SQL themselves — they call these
// instead, so the query logic lives in exactly one place.

export const createUser = async ({ fullName, username, email, passwordHash }) => {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, username, email, password_hash)
     VALUES (?, ?, ?, ?)`,
    [fullName, username, email, passwordHash]
  );

  return findUserById(result.insertId);
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

export const findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, profile_image, bio,
            verification_status, email_verified, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const markEmailVerified = async (id) => {
  await pool.query('UPDATE users SET email_verified = TRUE WHERE id = ?', [id]);
};

// Builds the UPDATE query dynamically so we only touch the fields the
// client actually sent, instead of overwriting everything with nulls.
export const updateUserProfile = async (id, fields) => {
  const allowedFields = ['full_name', 'username', 'bio', 'profile_image'];
  const updates = [];
  const values = [];

  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (updates.length === 0) {
    return findUserById(id);
  }

  values.push(id);
  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

  return findUserById(id);
};