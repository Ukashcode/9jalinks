import axios from 'axios';

// One shared axios instance for the whole app. baseURL comes from Vite's
// env system, so switching between local/dev/prod APIs is just a .env change.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attaches the JWT (if we have one) to every outgoing request automatically,
// so individual service functions never have to think about auth headers.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('9jalinks_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;