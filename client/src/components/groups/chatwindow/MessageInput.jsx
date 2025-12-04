import { useState } from 'react';

export default function MessageInput({ sending, onSend }) {
  const [draft, setDraft] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        gap: '.5rem',
        padding: '1rem',
        borderTop: '1px solid #1f2937',
      }}
    >
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: '.5rem',
          background: '#020617',
          borderRadius: '.4rem',
          border: '1px solid #374151',
          color: 'white',
        }}
      />
      <button
        disabled={sending}
        style={{
          padding: '.5rem .9rem',
          background: '#22c55e',
          borderRadius: '.4rem',
        }}
      >
        {sending ? '...' : 'Send'}
      </button>
    </form>
  );
}
