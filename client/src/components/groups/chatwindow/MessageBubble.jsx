export default function MessageBubble({ message, mine }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '65%',
          padding: '.45rem .7rem',
          borderRadius: '.65rem',
          background: mine ? '#22c55e' : '#111827',
          color: mine ? '#020617' : '#e5e7eb',
        }}
      >
        {!mine && (
          <div style={{ color: '#9ca3af', fontSize: '.75rem' }}>
            {message.senderDisplayName}
          </div>
        )}

        <div>{message.content}</div>

        <div
          style={{
            fontSize: '.65rem',
            opacity: 0.7,
            textAlign: 'right',
            marginTop: '.2rem',
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
