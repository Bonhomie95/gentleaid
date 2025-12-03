import React, { useState } from 'react';
import api from '../../api/http';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/useAuthStore';

export default function PhoneLoginPage() {
  const [step, setStep] = useState('PHONE'); // PHONE | OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return toast.error('Enter phone number');

    try {
      setLoading(true);
      await api.post('/auth/request-otp', { phone });
      toast.success('OTP sent');
      setStep('OTP');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error('Enter OTP');

    try {
      setLoading(true);
      const res = await api.post('/auth/verify-otp', { phone, code: otp });

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
      toast.error(err.response?.data?.message || 'Invalid OTP');
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
        <h2 style={{ marginBottom: '.5rem' }}>Sign in with Phone</h2>
        <p
          style={{
            color: '#9ca3af',
            marginBottom: '1.5rem',
            fontSize: '.9rem',
          }}
        >
          No email, no password. Just your phone number and a one-time code.
        </p>

        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp}>
            <label
              style={{
                display: 'block',
                fontSize: '.85rem',
                marginBottom: '.25rem',
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+2348012345678"
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
              Code sent to <strong>{phone}</strong>
            </div>

            <label
              style={{
                display: 'block',
                fontSize: '.85rem',
                marginBottom: '.25rem',
              }}
            >
              Enter OTP
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
              onClick={() => setStep('PHONE')}
              style={{
                ...buttonStyle,
                marginTop: '.5rem',
                background: 'transparent',
                border: '1px solid #4b5563',
              }}
            >
              Change phone number
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
