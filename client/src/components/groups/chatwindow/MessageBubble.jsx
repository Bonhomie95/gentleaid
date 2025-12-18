export default function MessageBubble({ message, mine, onReact, onReply }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: mine ? 'flex-end' : 'flex-start',
        marginBottom: '.5rem',
      }}
    >
      <div
        style={{
          fontSize: '.7rem',
          opacity: 0.7,
          marginBottom: '2px',
          paddingLeft: '6px',
        }}
      >
        {message.senderDisplayName}
      </div>
      {/* REPLY QUOTE */}
      {message.replyTo && (
        <div
          onClick={() => onReply?.(message.replyTo._id)}
          style={{
            maxWidth: '70%',
            fontSize: '.7rem',
            padding: '.3rem .5rem',
            borderLeft: '3px solid #22c55e',
            background: '#020617',
            marginBottom: '4px',
            cursor: 'pointer',
            opacity: 0.85,
          }}
        >
          {message.replyTo.content}
        </div>
      )}

      {/* MESSAGE BODY */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          onReact?.(message);
        }}
        style={{
          maxWidth: '75%',
          padding: '.6rem .8rem',
          borderRadius: '.75rem',
          background: mine ? '#22c55e' : '#1f2937',
          color: mine ? '#020617' : '#e5e7eb',
          wordBreak: 'break-word',
        }}
      >
        {message.type === 'voice' ? (
          <audio controls src={message.voiceUrl} />
        ) : (
          message.content
        )}
      </div>

      {/* TIMESTAMP */}
      <div
        style={{
          fontSize: '.65rem',
          opacity: 0.5,
          marginTop: '2px',
          paddingRight: mine ? '6px' : 0,
          paddingLeft: mine ? 0 : '6px',
        }}
      >
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* REACTIONS */}
      {message.reactions?.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '.25rem',
            marginTop: '2px',
          }}
        >
          {Object.entries(
            message.reactions.reduce((acc, r) => {
              acc[r.emoji] = (acc[r.emoji] || 0) + 1;
              return acc;
            }, {})
          ).map(([emoji, count]) => (
            <span
              key={emoji}
              onClick={() => onReact?.(message, emoji)}
              style={{
                fontSize: '.7rem',
                padding: '2px 6px',
                borderRadius: '999px',
                background: '#020617',
                border: '1px solid #334155',
                cursor: 'pointer',
              }}
            >
              {emoji} {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
