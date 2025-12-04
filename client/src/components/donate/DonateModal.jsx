import React, { useState } from 'react';
import api from '../../api/http';
import toast from 'react-hot-toast';

export default function DonateModal({ open, onClose }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount.trim()) return toast.error('Enter donation amount');

    try {
      setLoading(true);
      await api.post('/donations/create', { amount });
      toast.success('Donation registered, thank you!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: '.5rem' }}>Support someone today 💚</h3>
        <p
          style={{ fontSize: '.85rem', marginBottom: '1rem', color: '#9ca3af' }}
        >
          Every token of help creates a ripple of hope.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />

          <button disabled={loading} style={buttonStyle}>
            {loading ? 'Processing...' : 'Donate'}
          </button>
        </form>

        <button onClick={onClose} style={closeButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99,
};

const modalStyle = {
  width: '90%',
  maxWidth: '420px',
  background: '#020617',
  padding: '1.5rem',
  borderRadius: '.75rem',
  border: '1px solid #1f2937',
};

const inputStyle = {
  width: '100%',
  padding: '.65rem',
  borderRadius: '.5rem',
  border: '1px solid #374151',
  background: '#030712',
  color: '#e5e7eb',
  marginBottom: '1rem',
};

const buttonStyle = {
  width: '100%',
  padding: '.7rem',
  borderRadius: '.5rem',
  background: '#22c55e',
  color: '#020617',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  marginBottom: '.5rem',
};

const closeButtonStyle = {
  width: '100%',
  padding: '.5rem',
  borderRadius: '.5rem',
  background: 'transparent',
  border: '1px solid #4b5563',
  color: '#e5e7eb',
  cursor: 'pointer',
};
