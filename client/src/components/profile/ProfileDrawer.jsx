import React, { useState } from 'react';
import api from '../../api/http';
import { useAuthStore } from '../../context/useAuthStore';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileDrawer({ open, onClose }) {
  const { user, setAuth } = useAuthStore();

  const [username, setUsername] = useState(user.username || '');
  const [firstName, setFirst] = useState(user.firstName || '');
  const [lastName, setLast] = useState(user.lastName || '');
  const [displayAsUsername, setDisplayAsUsername] = useState(
    user.displayAsUsername
  );
  const [avatar, setAvatar] = useState(user.avatar);
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const res = await api.patch('/user/update-profile', {
        username,
        firstName,
        lastName,
        displayAsUsername,
        avatar,
      });

      setAuth({ user: res.data.user });
      toast.success('Profile updated');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={drawerOverlay}>
      <div style={drawer}>
        {/* HEADER */}
        <div style={header}>
          <h2>My Profile</h2>
          <button style={iconBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* AVATAR */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <img
            src={avatar || '/default-avatar.png'}
            alt="avatar"
            width={80}
            height={80}
            style={{ borderRadius: '999px', marginBottom: '.5rem' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const form = new FormData();
              form.append('file', file);

              const upload = await api.post('/upload/single', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });

              setAvatar(upload.data.url);
            }}
          />
        </div>

        {/* FIELDS */}
        <div style={form}>
          <label>Username</label>
          <input
            style={input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>First Name</label>
          <input
            style={input}
            value={firstName}
            onChange={(e) => setFirst(e.target.value)}
          />

          <label>Last Name</label>
          <input
            style={input}
            value={lastName}
            onChange={(e) => setLast(e.target.value)}
          />

          <label>Identity Mode</label>
          <select
            style={input}
            value={displayAsUsername ? 'USERNAME' : 'REALNAME'}
            onChange={(e) =>
              setDisplayAsUsername(e.target.value === 'USERNAME')
            }
          >
            <option value="USERNAME">Show Username</option>
            <option value="REALNAME">Show Real Name</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <button style={saveBtn} onClick={updateProfile} disabled={loading}>
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

/* ------ styles ------ */

const drawerOverlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.5)',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 40,
};

const drawer = {
  width: '350px',
  height: '100%',
  background: '#020617',
  borderLeft: '1px solid #1f2937',
  padding: '1rem',
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
};

const iconBtn = {
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  color: '#e5e7eb',
};

const form = {
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '.5rem',
};

const input = {
  padding: '.6rem',
  borderRadius: '.5rem',
  border: '1px solid #334155',
  background: '#020617',
  color: '#e5e7eb',
};

const saveBtn = {
  width: '100%',
  marginTop: '1rem',
  padding: '.75rem',
  background: '#22c55e',
  color: '#020617',
  fontWeight: 600,
  borderRadius: '.5rem',
  cursor: 'pointer',
};
