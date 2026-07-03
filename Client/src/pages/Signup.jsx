import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Button from '../components/Button.jsx';
import { registerUser } from '../services/authService.js';

const INITIAL_FORM = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /\d/.test(v) },
];

const Signup = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(form);
      // Account is created but unverified — send the user to enter the
      // OTP that was just emailed to them, instead of logging in now.
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="font-display text-2xl font-extrabold text-primary-900">
        Create your seller account
      </h1>
      <p className="mt-2 font-body text-primary-500">
        Start building buyer trust with a verified profile.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          id="fullName"
          name="fullName"
          label="Full name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <Input
          id="username"
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
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
          requirements={PASSWORD_REQUIREMENTS}
        />
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          requirements={[
            {
              label: 'Matches password above',
              test: (v) => v.length > 0 && v === form.password,
            },
          ]}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" variant="primary" disabled={loading} className="mt-2">
          {loading ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-primary-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-700 underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;