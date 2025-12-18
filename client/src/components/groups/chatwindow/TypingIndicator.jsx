import { useEffect, useRef, useState } from 'react';
import { socket } from '../../../socket';

export default function TypingIndicator({ groupId, user }) {
  const [typingUsers, setTypingUsers] = useState([]);
  const timers = useRef({}); // userId -> timeout

  useEffect(() => {
    const onTyping = ({ groupId: gId, userId, displayName }) => {
      if (String(gId) !== String(groupId)) return;
      if (userId === user._id) return;

      setTypingUsers((prev) => {
        const exists = prev.some((u) => u.userId === userId);
        return exists ? prev : [...prev, { userId, displayName }];
      });

      clearTimeout(timers.current[userId]);
      timers.current[userId] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
      }, 1500);
    };

    const onStop = ({ groupId: gId, userId }) => {
      if (String(gId) !== String(groupId)) return;
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
      clearTimeout(timers.current[userId]);
      delete timers.current[userId];
    };

    socket.on('typing', onTyping);
    socket.on('stop_typing', onStop);

    return () => {
      socket.off('typing', onTyping);
      socket.off('stop_typing', onStop);
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    };
  }, [groupId, user?._id]);

  if (!typingUsers.length) return null;

  return (
    <div style={{ paddingLeft: '1rem', fontSize: '.75rem', color: '#94a3b8' }}>
      {typingUsers.map((u) => u.displayName).join(', ')} typing...
    </div>
  );
}
