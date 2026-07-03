import jwt from 'jsonwebtoken';

// Signs a JWT containing just the user's id. Keep the payload small —
// anything else needed (name, email, etc.) should be fetched fresh from
// the DB via the /profile endpoint, not trusted from the token.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;