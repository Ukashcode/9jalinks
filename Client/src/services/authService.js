import api from './api.js';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const verifyOtp = async ({ email, otp }) => {
  const { data } = await api.post('/auth/verify-otp', { email, otp });
  return data;
};

export const resendOtp = async (email) => {
  const { data } = await api.post('/auth/resend-otp', { email });
  return data;
};