import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

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
      <div style={{ maxWidth: '540px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
          GentelAid — Men Helping Men
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          A safe space for men to talk, support each other, and share donations
          towards real needs — health, legal issues, rent, education, and more.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '.8rem 1.4rem',
            borderRadius: '.5rem',
            border: 'none',
            background: '#22c55e',
            color: '#020617',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Continue with Phone Number
        </button>
      </div>
    </div>
  );
}
