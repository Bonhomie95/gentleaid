import React, { useState } from 'react';
import api from '../../api/http';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export default function HelpRequestModal({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!title || !desc || !amount) {
      return toast.error('All fields required');
    }

    try {
      setLoading(true);

      let uploaded = [];

      for (let file of attachments) {
        const form = new FormData();
        form.append('file', file);
        const up = await api.post('/upload/single', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploaded.push(up.data.url);
      }

      const res = await api.post('/help/create', {
        title,
        description: desc,
        amountRequested: Number(amount),
        attachments: uploaded,
      });

      toast.success(res.data.message);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h2>Request Help</h2>
          <button onClick={onClose} style={iconBtn}>
            <X size={18} />
          </button>
        </div>

        <div style={form}>
          <label>Title</label>
          <input
            style={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            style={{ ...input, height: '120px' }}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <label>Amount Needed (USD)</label>
          <input
            style={input}
            value={amount}
            type="number"
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Attachments (optional)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setAttachments([...e.target.files])}
            style={{ marginTop: '.5rem' }}
          />
        </div>

        <button disabled={loading} onClick={submit} style={submitBtn}>
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>
    </div>
  );
}

/* STYLES */
const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 40,
};

const modal = {
  width: '450px',
  background: '#020617',
  padding: '1.5rem',
  borderRadius: '.75rem',
  border: '1px solid #1f2937',
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '1rem',
};

const iconBtn = {
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  color: '#e5e7eb',
};

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: '.5rem',
};

const input = {
  padding: '.6rem',
  borderRadius: '.5rem',
  background: '#020617',
  border: '1px solid #334155',
  color: '#e5e7eb',
};

const submitBtn = {
  marginTop: '1rem',
  width: '100%',
  padding: '.75rem',
  background: '#22c55e',
  borderRadius: '.5rem',
  color: '#020617',
  fontWeight: 600,
  cursor: 'pointer',
};
