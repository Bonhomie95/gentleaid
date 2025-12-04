import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../../context/useAuthStore';
import api from '../../api/http';
import useResponsive from '../../hooks/useResponsive';
import { socket, connectSocketWithToken } from '../../socket';
import { Sun, Moon, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GroupsPage() {
  const { user, token } = useAuthStore();
  const { isMobile } = useResponsive();

  const [theme, setTheme] = useState('dark');
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState('LIST'); // LIST | CHAT

  // Apply theme to body
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  // Connect socket on mount when token ready
  useEffect(() => {
    if (!token) return;
    connectSocketWithToken(token);

    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [token]);

  // Fetch groups once
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get('/groups');
        setGroups(res.data.groups || res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load groups');
      }
    };
    fetchGroups();
  }, []);

  // Fetch messages when activeGroupId changes
  useEffect(() => {
    if (!activeGroupId) return;

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        // adjust URL if your chat routes differ
        const res = await api.get(`/chat/group/${activeGroupId}`);
        setMessages(res.data.messages || res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeGroupId]);

  // Join/leave room via sockets when activeGroupId changes
  useEffect(() => {
    if (!socket.connected || !activeGroupId) return;

    socket.emit('joinRoom', activeGroupId);

    return () => {
      socket.emit('leaveRoom', activeGroupId);
    };
  }, [activeGroupId]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (msg) => {
      if (msg.groupId !== activeGroupId) return;
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    };

    socket.on('message:new', handleNewMessage);
    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [activeGroupId]);

  const activeGroup = useMemo(
    () => groups.find((g) => g._id === activeGroupId) || null,
    [groups, activeGroupId]
  );

  const isMember = useMemo(() => {
    if (!user || !activeGroup) return false;
    // adjust based on your group schema:
    // either activeGroup.members is an array of userIds
    if (Array.isArray(activeGroup.members)) {
      return activeGroup.members.includes(user._id);
    }
    // or you might already have a boolean
    return !!activeGroup.isMember;
  }, [user, activeGroup]);

  const handleSelectGroup = (groupId) => {
    setActiveGroupId(groupId);
    if (isMobile) setMobileView('CHAT');
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    if (!activeGroupId) return;
    if (!isMember) return toast.error('Join group to send messages');

    try {
      setSending(true);

      // optimistically send via HTTP (optional)
      await api.post(`/chat/group/${activeGroupId}`, { content });

      // emit via socket
      socket.emit('message:send', {
        groupId: activeGroupId,
        content,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!activeGroupId) return;
    try {
      await api.post(`/groups/${activeGroupId}/join`);
      toast.success('Joined group');

      // update local group state
      setGroups((prev) =>
        prev.map((g) =>
          g._id === activeGroupId
            ? {
                ...g,
                isMember: true,
                members: g.members ? [...g.members, user._id] : [user._id],
              }
            : g
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to join group');
    }
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // LAYOUT

  if (isMobile) {
    return (
      <div style={rootStyle(theme)}>
        <MobileTopBar
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuToggle={() => setMobileMenuOpen((o) => !o)}
        />

        {mobileMenuOpen && (
          <MobileMenu onClose={() => setMobileMenuOpen(false)} />
        )}

        {mobileView === 'LIST' && (
          <GroupList
            groups={groups}
            activeGroupId={activeGroupId}
            onSelect={handleSelectGroup}
          />
        )}

        {mobileView === 'CHAT' && activeGroup && (
          <ChatWindow
            theme={theme}
            group={activeGroup}
            messages={messages}
            loadingMessages={loadingMessages}
            isMember={isMember}
            onBack={() => setMobileView('LIST')}
            onSendMessage={handleSendMessage}
            sending={sending}
            onJoinGroup={handleJoinGroup}
          />
        )}
      </div>
    );
  }

  // DESKTOP
  return (
    <div style={rootStyle(theme)}>
      <div style={desktopContainerStyle}>
        <div style={sidebarStyle}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Groups</h2>
          <GroupList
            groups={groups}
            activeGroupId={activeGroupId}
            onSelect={handleSelectGroup}
          />
        </div>

        <div style={mainChatAreaStyle}>
          <DesktopTopBar theme={theme} toggleTheme={toggleTheme} />

          {activeGroup ? (
            <ChatWindow
              theme={theme}
              group={activeGroup}
              messages={messages}
              loadingMessages={loadingMessages}
              isMember={isMember}
              onSendMessage={handleSendMessage}
              sending={sending}
              onJoinGroup={handleJoinGroup}
            />
          ) : (
            <div style={emptyStateStyle}>
              <p style={{ color: '#9ca3af' }}>
                Select a group to view messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----- layout & subcomponents ----- */

function MobileTopBar({ theme, toggleTheme, onMenuToggle }) {
  return (
    <div
      style={{
        padding: '.75rem 1rem',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: theme === 'dark' ? '#020617' : '#f3f4f6',
      }}
    >
      <span style={{ fontWeight: 700 }}>GentelAid</span>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <button
          onClick={toggleTheme}
          style={iconButtonStyle}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={onMenuToggle}
          style={iconButtonStyle}
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 48,
        right: 8,
        zIndex: 40,
        background: '#020617',
        border: '1px solid #1f2937',
        borderRadius: '.5rem',
        padding: '.75rem',
        minWidth: '180px',
      }}
    >
      <button style={menuItemStyle}>Donate</button>
      <button style={menuItemStyle}>Request Help</button>
      <button style={menuItemStyle} onClick={onClose}>
        <X size={16} style={{ marginRight: 4 }} /> Close
      </button>
    </div>
  );
}

function DesktopTopBar({ theme, toggleTheme }) {
  return (
    <div
      style={{
        padding: '.75rem 1rem',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button style={pillButtonStyle}>Donate</button>
        <button style={{ ...pillButtonStyle, background: '#0ea5e9' }}>
          Request Help
        </button>
      </div>
      <button
        onClick={toggleTheme}
        style={iconButtonStyle}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}

function GroupList({ groups, activeGroupId, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
      {groups.map((g) => (
        <button
          key={g._id}
          onClick={() => onSelect(g._id)}
          style={{
            textAlign: 'left',
            padding: '.6rem .7rem',
            borderRadius: '.5rem',
            border: '1px solid #111827',
            background: activeGroupId === g._id ? '#111827' : 'transparent',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{g.name}</div>
          {g.description && (
            <div
              style={{
                fontSize: '.8rem',
                color: '#9ca3af',
                marginTop: '.1rem',
              }}
            >
              {g.description}
            </div>
          )}
          <div
            style={{
              fontSize: '.75rem',
              color: '#6b7280',
              marginTop: '.1rem',
            }}
          >
            {g.memberCount || 0} members
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatWindow({
  theme,
  group,
  messages,
  loadingMessages,
  isMember,
  onSendMessage,
  sending,
  onJoinGroup,
  onBack,
}) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!isMember) return;
    if (!draft.trim()) return;
    onSendMessage(draft);
    setDraft('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Chat header */}
      <div
        style={{
          padding: '.75rem 1rem',
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '.5rem',
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{ ...iconButtonStyle, padding: '.3rem .4rem' }}
          >
            <X size={16} />
          </button>
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: '.95rem' }}>
            {group.name}
          </div>
          {group.description && (
            <div style={{ fontSize: '.8rem', color: '#9ca3af' }}>
              {group.description}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={messageListWrapperStyle}>
        {loadingMessages ? (
          <div style={{ color: '#9ca3af', fontSize: '.9rem' }}>Loading…</div>
        ) : (
          <MessageList messages={messages} theme={theme} />
        )}
      </div>

      {/* Join banner or input */}
      {!isMember ? (
        <div
          style={{
            padding: '.75rem 1rem',
            borderTop: '1px solid #1f2937',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '.75rem',
          }}
        >
          <div style={{ fontSize: '.8rem', color: '#9ca3af' }}>
            You can read messages. Join this group to contribute.
          </div>
          <button
            onClick={onJoinGroup}
            style={{ ...pillButtonStyle, background: '#22c55e' }}
          >
            Join Group
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={inputBarWrapperStyle}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            style={chatInputStyle}
          />
          <button type="submit" disabled={sending} style={sendButtonStyle}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </div>
  );
}

function MessageList({ messages }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
      {messages.map((m) => (
        <div key={m._id || m.createdAt} style={messageBubbleStyle}>
          <div style={{ fontSize: '.8rem', color: '#9ca3af' }}>
            {m.senderDisplayName || 'Anonymous'}
          </div>
          <div style={{ fontSize: '.9rem' }}>{m.content}</div>
          <div
            style={{
              fontSize: '.7rem',
              color: '#6b7280',
              marginTop: '.1rem',
            }}
          >
            {new Date(m.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----- styles ----- */

const rootStyle = (theme) => ({
  minHeight: '100vh',
  background: theme === 'dark' ? '#020617' : '#f9fafb',
  color: theme === 'dark' ? '#e5e7eb' : '#111827',
});

const desktopContainerStyle = {
  display: 'flex',
  height: '100vh',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1rem',
  gap: '1rem',
};

const sidebarStyle = {
  width: '280px',
  borderRadius: '.75rem',
  border: '1px solid #1f2937',
  padding: '1rem',
  overflowY: 'auto',
};

const mainChatAreaStyle = {
  flex: 1,
  borderRadius: '.75rem',
  border: '1px solid #1f2937',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const emptyStateStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const iconButtonStyle = {
  border: '1px solid #374151',
  borderRadius: '999px',
  padding: '.35rem .4rem',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pillButtonStyle = {
  padding: '.4rem .8rem',
  borderRadius: '999px',
  border: 'none',
  background: '#22c55e',
  color: '#020617',
  cursor: 'pointer',
  fontSize: '.8rem',
  fontWeight: 600,
};

const menuItemStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '.4rem .5rem',
  fontSize: '.85rem',
  background: 'transparent',
  border: 'none',
  color: '#e5e7eb',
  cursor: 'pointer',
};

const messageListWrapperStyle = {
  flex: 1,
  padding: '.75rem 1rem',
  overflowY: 'auto',
};

const messageBubbleStyle = {
  borderRadius: '.5rem',
  border: '1px solid #111827',
  padding: '.4rem .6rem',
  background: '#020617',
};

const inputBarWrapperStyle = {
  padding: '.5rem .75rem',
  borderTop: '1px solid #1f2937',
  display: 'flex',
  gap: '.5rem',
};

const chatInputStyle = {
  flex: 1,
  borderRadius: '.5rem',
  border: '1px solid #374151',
  padding: '.5rem .7rem',
  background: '#020617',
  color: '#e5e7eb',
};

const sendButtonStyle = {
  borderRadius: '.5rem',
  border: 'none',
  padding: '.5rem .9rem',
  background: '#22c55e',
  color: '#020617',
  fontWeight: 600,
  cursor: 'pointer',
};
