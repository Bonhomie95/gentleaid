// src/pages/groups/GroupsPage.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../context/useAuthStore';
import { socket } from '../../socket';
import api from '../../api/http';

// UI Components
import GroupSidebar from '../../components/groups/GroupSidebar';
import GroupTopBar from '../../components/groups/GroupTopBar';
import MobileTopBar from '../../components/groups/MobileTopBar';
import MobileMenu from '../../components/groups/MobileMenu';
import ChatWindow from '../../components/groups/ChatWindow/ChatWindow';

// Modals / Drawers
import HelpRequestModal from '../../components/help/HelpRequestModal';
import DonateModal from '../../components/donate/DonateModal';
import ProfileDrawer from '../../components/profile/ProfileDrawer';

export default function GroupsPage() {
  const { user, theme, toggleTheme } = useAuthStore();

  const [groups, setGroups] = useState([]); // all groups
  const [myGroups, setMyGroups] = useState([]); // array of group IDs the user belongs to
  const [activeGroup, setActiveGroup] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [search, setSearch] = useState('');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // -------------------------
  // Load messages for group
  // -------------------------
  const loadMessages = async (groupId) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/group/${groupId}`);
      const data = Array.isArray(res.data.messages)
        ? res.data.messages
        : res.data || [];
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
      setMessages([]);
    }
    setLoadingMessages(false);
  };

  // -------------------------
  // Select group
  // -------------------------
  const handleSelectGroup = async (group) => {
    if (!group || !group._id) return;

    setActiveGroup(group);
    setIsMember(myGroups.includes(group._id));

    socket.emit('join_group', { groupId: group._id });
    await loadMessages(group._id);
  };

  // -------------------------
  // Join group
  // -------------------------
  const handleJoinGroup = async () => {
    if (!activeGroup) return;
    try {
      const res = await api.post(`/groups/${activeGroup._id}/join`);
      if (res.data?.isMember) {
        setIsMember(true);
        setMyGroups((prev) =>
          prev.includes(activeGroup._id) ? prev : [...prev, activeGroup._id]
        );
        setGroups((prev) =>
          prev.map((g) =>
            g._id === activeGroup._id
              ? { ...g, memberCount: (g.memberCount || 0) + 1 }
              : g
          )
        );
      }
    } catch (err) {
      console.error('Join group failed', err);
    }
  };

  // -------------------------
  // Send message
  // -------------------------
  const handleSendMessage = async (text) => {
    if (!activeGroup || !isMember || !text.trim()) return;

    setSending(true);
    try {
      socket.emit('send_message', {
        groupId: activeGroup._id,
        senderId: user._id,
        content: text.trim(),
      });
    } finally {
      setSending(false);
    }
  };

  // Listen on new messages
  useEffect(() => {
    const handler = (msg) => {
      if (msg.groupId === activeGroup?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('new_message', handler);
    return () => socket.off('new_message', handler);
  }, [activeGroup]);

  // -------------------------
  // Initial load
  // -------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, myGroupsRes] = await Promise.all([
          api.get('/groups'),
          api.get('/groups/mine'),
        ]);

        const groupsData = Array.isArray(groupsRes.data)
          ? groupsRes.data
          : groupsRes.data?.groups || [];

        const myGroupsData = Array.isArray(myGroupsRes.data)
          ? myGroupsRes.data
          : myGroupsRes.data?.groups || [];

        setGroups(groupsData);
        setMyGroups(myGroupsData.map((g) => g._id));
      } catch (err) {
        console.error('Failed to load groups', err);
        setGroups([]);
        setMyGroups([]);
      }
    };

    fetchData();
  }, []);

  // -------------------------
  // Filter groups
  // -------------------------
  const filteredGroups = groups.filter((g) =>
    (g.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // -------------------------
  // Layout
  // -------------------------
  const layoutStyle = {
    display: 'flex',
    height: '100vh',
    background: theme === 'dark' ? '#0f172a' : '#ffffff',
    color: theme === 'dark' ? '#e2e8f0' : '#111',
  };

  return (
    <>
      <div style={layoutStyle}>
        {/* MOBILE TOP BAR */}
        {isMobile && (
          <MobileTopBar
            theme={theme}
            toggleTheme={toggleTheme}
            onMenuToggle={() => setMobileMenuOpen((p) => !p)}
          />
        )}

        {/* SIDEBAR (HIDE ON MOBILE) */}
        {!isMobile && (
          <GroupSidebar
            groups={filteredGroups}
            search={search}
            setSearch={setSearch}
            activeGroupId={activeGroup?._id}
            onSelect={handleSelectGroup}
          />
        )}

        {/* MAIN CHAT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!isMobile && (
            <GroupTopBar
              theme={theme}
              toggleTheme={toggleTheme}
              onOpenHelp={() => {
                setHelpOpen(true);
                console.log('clicked me here');
              }}
              onOpenProfile={() => setProfileOpen(true)}
              onOpenDonate={() => setDonateOpen(true)}
            />
          )}

          {mobileMenuOpen && isMobile && (
            <MobileMenu
              onClose={() => setMobileMenuOpen(false)}
              onOpenHelp={() => setHelpOpen(true)}
              onOpenProfile={() => setProfileOpen(true)}
              onOpenDonate={() => setDonateOpen(true)}
            />
          )}

          {activeGroup ? (
            <ChatWindow
              theme={theme}
              user={user}
              group={activeGroup}
              messages={messages}
              loadingMessages={loadingMessages}
              isMember={isMember}
              onSendMessage={handleSendMessage}
              sending={sending}
              onJoinGroup={handleJoinGroup}
              onBack={() => setActiveGroup(null)}
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.6,
              }}
            >
              Select a group to begin
            </div>
          )}
        </div>
      </div>

      {/* MODALS / DRAWERS */}
      {helpOpen && <HelpRequestModal onClose={() => setHelpOpen(false)} />}
      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      {profileOpen && <ProfileDrawer onClose={() => setProfileOpen(false)} />}
    </>
  );
}
