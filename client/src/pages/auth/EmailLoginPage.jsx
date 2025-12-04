import React, { useState } from 'react';
import api from '../../api/http';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/useAuthStore';

export default function EmailLoginPage() {
  const [step, setStep] = useState('EMAIL'); // EMAIL | OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  // Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter your email');

    try {
      setLoading(true);
      await api.post('/auth/send-otp', { email });
      toast.success('Verification code sent to your email');
      setStep('OTP');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error('Enter your code');

    try {
      setLoading(true);

      const res = await api.post('/auth/verify-otp', { email, code: otp });
      const { token, user, isNewUser } = res.data;

      setAuth({ token, user });

      if (isNewUser) {
        navigate('/complete-profile', { replace: true });
      } else {
        const redirectTo = location.state?.from?.pathname || '/app/groups';
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#020617',
          borderRadius: '.75rem',
          border: '1px solid #1f2937',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ marginBottom: '.5rem' }}>Sign in with Email</h2>

        <p
          style={{
            color: '#9ca3af',
            marginBottom: '1.5rem',
            fontSize: '.9rem',
          }}
        >
          No password needed. Enter your email and we’ll send a one-time login
          code.
        </p>

        {step === 'EMAIL' && (
          <form onSubmit={handleSendOtp}>
            <label
              style={{
                display: 'block',
                fontSize: '.85rem',
                marginBottom: '.25rem',
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp}>
            <div
              style={{
                marginBottom: '.75rem',
                fontSize: '.9rem',
                color: '#9ca3af',
              }}
            >
              Code sent to <strong>{email}</strong>
            </div>

            <label
              style={{
                display: 'block',
                fontSize: '.85rem',
                marginBottom: '.25rem',
              }}
            >
              Enter Code
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => setStep('EMAIL')}
              style={{
                ...buttonStyle,
                color: 'white',
                marginTop: '.5rem',
                background: 'transparent',
                border: '1px solid #4b5563',
              }}
            >
              Change email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '.7rem .8rem',
  borderRadius: '.5rem',
  border: '1px solid #374151',
  background: '#020617',
  color: '#e5e7eb',
  marginBottom: '1rem',
};

const buttonStyle = {
  width: '100%',
  padding: '.75rem',
  borderRadius: '.5rem',
  border: 'none',
  background: '#22c55e',
  color: '#020617',
  fontWeight: 600,
  cursor: 'pointer',
};
