import { useState, useRef } from 'react';
import { socket } from '../../../socket';
import api from '../../../api/http';

export default function MessageInput({
  sending,
  onSend,
  user,
  groupId,
  displayName,
}) {
  const [draft, setDraft] = useState('');
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    recorderRef.current = mediaRecorder;

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];

        const res = await api.post('/chat/voice/upload', {
          base64,
          mimeType: blob.type,
          durationMs: Math.round(blob.size / 100),
        });

        onSend({
          type: 'voice',
          voiceUrl: res.data.voiceUrl,
          durationMs: res.data.durationMs,
        });
      };

      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
  };

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend({ type: 'text', content: draft });
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
      <button
        type="button"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
      >
        🎤
      </button>

      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          socket.emit('typing', { groupId, userId: user._id, displayName });
        }}
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

      <button disabled={sending}>Send</button>
    </form>
  );
}
