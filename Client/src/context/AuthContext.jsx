import { createContext, useState, useEffect } from 'react';
import { fetchProfile } from '../services/profileService.js';

export const AuthContext = createContext(null);

const TOKEN_KEY = '9jalinks_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is already in localStorage from a previous
  // session, try to restore the logged-in user instead of forcing a re-login.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};