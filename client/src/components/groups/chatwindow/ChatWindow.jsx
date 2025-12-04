import { useRef, useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({
  user,
  group,
  messages,
  loadingMessages,
  isMember,
  onSendMessage,
  sending,
  onJoinGroup,
  onBack,
}) {
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleScroll = () => {
    const div = containerRef.current;
    const isBottom = div.scrollTop + div.clientHeight >= div.scrollHeight - 5;
    setAutoScroll(isBottom);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* CHAT HEADER */}
      <div
        style={{
          padding: '.75rem 1rem',
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          gap: '.5rem',
        }}
      >
        {onBack && (
          <button
            style={{ border: 'none', background: 'transparent' }}
            onClick={onBack}
          >
            ⬅
          </button>
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{group.name}</div>
          {group.description && (
            <div style={{ fontSize: '.8rem', color: '#9ca3af' }}>
              {group.description}
            </div>
          )}
        </div>
      </div>

      {/* LIST */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}
      >
        {loadingMessages ? (
          'Loading...'
        ) : (
          <MessageList messages={messages} currentUserId={user._id} />
        )}
      </div>

      <TypingIndicator groupId={group._id} user={user} />

      {isMember ? (
        <MessageInput sending={sending} onSend={onSendMessage} />
      ) : (
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #1f2937',
          }}
        >
          <span style={{ fontSize: '.8rem', color: '#9ca3af' }}>
            Join to chat
          </span>
          <button
            style={{
              padding: '.4rem .8rem',
              background: '#22c55e',
              borderRadius: '.4rem',
            }}
            onClick={onJoinGroup}
          >
            Join
          </button>
        </div>
      )}
    </div>
  );
}
