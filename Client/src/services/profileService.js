import api from './api.js';

export const fetchProfile = async () => {
  const { data } = await api.get('/profile/me');
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put('/profile/me', payload);
  return data;
};