import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, currentUserId }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
      {messages.map(msg =>
        <MessageBubble
          key={msg._id}
          message={msg}
          mine={msg.senderId === currentUserId}
        />
      )}
    </div>
  );
}
