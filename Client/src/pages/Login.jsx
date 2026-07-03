import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { loginUser } from '../services/authService.js';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate('/profile');
    } catch (err) {
      if (err.response?.data?.data?.requiresVerification) {
        navigate('/verify-otp', { state: { email: err.response.data.data.email } });
        return;
      }
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="font-display text-2xl font-extrabold text-primary-900">Welcome back</h1>
      <p className="mt-2 font-body text-primary-500">Log in to manage your seller profile.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" variant="primary" disabled={loading} className="mt-2">
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-primary-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-primary-700 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;