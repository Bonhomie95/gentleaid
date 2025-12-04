import { useEffect, useState } from 'react';
import { socket } from '../../../socket';

export default function TypingIndicator({ user }) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const t = ({ userId, displayName }) => {
      if (userId === user._id) return;
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === userId)
          ? prev
          : [...prev, { userId, displayName }]
      );
    };

    const stop = ({ userId }) =>
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));

    socket.on('typing', t);
    socket.on('stop_typing', stop);

    return () => {
      socket.off('typing', t);
      socket.off('stop_typing', stop);
    };
  }, []);

  if (typingUsers.length === 0) return null;

  return (
    <div style={{ paddingLeft: '1rem', fontSize: '.75rem', color: '#94a3b8' }}>
      {typingUsers.map((u) => u.displayName).join(', ')} typing...
    </div>
  );
}
