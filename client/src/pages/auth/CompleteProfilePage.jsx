import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/http';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../context/useAuthStore';

export default function CompleteProfilePage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [useRealName, setUseRealName] = useState(
    user?.displayPreference === 'REAL_NAME'
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) return toast.error('Username is required');

    try {
      setLoading(true);
      const res = await api.patch('/users/update', {
        username,
        firstName,
        lastName,
        displayPreference: useRealName ? 'REAL_NAME' : 'USERNAME',
      });

      updateUser(res.data.user);
      toast.success('Profile updated');
      navigate('/app/groups', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
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
          maxWidth: '480px',
          background: '#020617',
          borderRadius: '.75rem',
          border: '1px solid #1f2937',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ marginBottom: '.5rem' }}>Complete your profile</h2>
        <p
          style={{
            color: '#9ca3af',
            fontSize: '.9rem',
            marginBottom: '1.25rem',
          }}
        >
          Choose how you want to appear in groups. You can stay anonymous
          (username) or use your real name.
        </p>

        <form onSubmit={handleSave}>
          <label style={labelStyle}>Username (for anonymity)</label>
          <input
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="gentle_lion"
          />

          <label style={labelStyle}>First name (optional)</label>
          <input
            style={inputStyle}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
          />

          <label style={labelStyle}>Last name (optional)</label>
          <input
            style={inputStyle}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
          />

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.5rem',
              marginTop: '.75rem',
              marginBottom: '1rem',
              fontSize: '.9rem',
            }}
          >
            <input
              type="checkbox"
              checked={useRealName}
              onChange={(e) => setUseRealName(e.target.checked)}
            />
            Show my real name in chats instead of username
          </label>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Saving...' : 'Save & Enter GentelAid'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '.85rem',
  marginBottom: '.25rem',
};

const inputStyle = {
  width: '100%',
  padding: '.7rem .8rem',
  borderRadius: '.5rem',
  border: '1px solid #374151',
  background: '#020617',
  color: '#e5e7eb',
  marginBottom: '.9rem',
};

const buttonStyle = {
  width: '100%',
  padding: '.8rem',
  borderRadius: '.5rem',
  border: 'none',
  background: '#22c55e',
  color: '#020617',
  fontWeight: 600,
  cursor: 'pointer',
};
