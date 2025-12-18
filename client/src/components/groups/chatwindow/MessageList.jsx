import { useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({
  messages,
  currentUserId,
  onReact,
  onReply,
}) {
  const messageRefs = useRef({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
      {messages.map((msg) => (
        <div ref={(el) => (messageRefs.current[msg._id] = el)} key={msg._id}>
           {/* {console.log('Rendering message', msg)} */}
          <MessageBubble
            message={msg}
            mine={msg.senderId === currentUserId}
            onScrollToReply={(id) => {
              messageRefs.current[id]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }}
            onReact={onReact}
            onReply={onReply}
          />
        </div>
      ))}
    </div>
  );
}
