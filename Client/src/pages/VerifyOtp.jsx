import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import OtpInput from '../components/OtpInput.jsx';
import Button from '../components/Button.jsx';
import VerifiedSeal from '../components/VerifiedSeal.jsx';
import useAuth from '../hooks/useAuth.js';
import { verifyOtp, resendOtp } from '../services/authService.js';

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Email is passed via navigation state from Signup/Login. If someone
  // lands here directly without it, send them back to sign up.
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = useCallback(
    async (e) => {
      e?.preventDefault();
      if (otp.length !== 6) {
        setError('Enter all 6 digits.');
        return;
      }

      setError('');
      setVerifying(true);

      try {
        const res = await verifyOtp({ email, otp });
        login(res.data.user, res.data.token);
        navigate('/profile');
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed. Please try again.');
      } finally {
        setVerifying(false);
      }
    },
    [otp, email, login, navigate]
  );

  // Auto-submit the moment all 6 digits are filled, so the user doesn't
  // have to hunt for a submit button.
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp, handleVerify]);

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);

    try {
      await resendOtp(email);
      setInfo('A new code has been sent to your email.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp('');
    } catch (err) {
      const retryAfter = err.response?.data?.retryAfterSeconds;
      if (retryAfter) setCooldown(retryAfter);
      setError(err.response?.data?.message || 'Could not resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <VerifiedSeal className="h-12 w-12" />
      <h1 className="mt-4 font-display text-2xl font-extrabold text-primary-900">
        Verify your email
      </h1>
      <p className="mt-2 font-body text-primary-500">
        We sent a 6-digit code to <span className="font-medium text-primary-900">{email}</span>
      </p>

      <form onSubmit={handleVerify} className="mt-8 flex w-full flex-col items-center gap-4">
        <OtpInput value={otp} onChange={setOtp} />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {info && !error && <p className="text-sm text-success-700">{info}</p>}

        <Button type="submit" variant="primary" disabled={verifying} className="w-full">
          {verifying ? 'Verifying…' : 'Verify code'}
        </Button>
      </form>

      <div className="mt-6 font-body text-sm text-primary-500">
        Didn't get the code?{' '}
        {cooldown > 0 ? (
          <span>Resend available in {cooldown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-primary-700 underline disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
        )}
      </div>

      <Link to="/signup" className="mt-8 text-sm text-primary-500 underline">
        Use a different email
      </Link>
    </div>
  );
};

export default VerifyOtp;