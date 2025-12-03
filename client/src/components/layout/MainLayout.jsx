import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/useAuthStore';

export default function MainLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const displayName =
    user?.displayPreference === 'REAL_NAME'
      ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
      : user?.username || 'Anon';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      {/* Left side: simple sidebar placeholder */}
      <aside
        style={{
          width: '260px',
          background: '#020617',
          borderRight: '1px solid #1f2937',
          padding: '1rem',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', color: '#e5e7eb' }}>GentelAid</h2>

        <nav
          style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}
        >
          <button onClick={() => navigate('/app/groups')} style={navBtnStyle}>
            Groups
          </button>

          {/* later: KYC, Help Requests, Donations, Profile, etc */}
        </nav>

        <div style={{ marginTop: 'auto', fontSize: '.9rem' }}>
          <div style={{ color: '#9ca3af', marginBottom: '.5rem' }}>
            Logged in as
          </div>
          <div style={{ color: '#e5e7eb', fontWeight: 500 }}>{displayName}</div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              ...navBtnStyle,
              marginTop: '.75rem',
              background: '#111827',
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Right side: main content */}
      <main style={{ flex: 1, padding: '1.5rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

const navBtnStyle = {
  background: '#111827',
  borderRadius: '.5rem',
  border: '1px solid #1f2937',
  padding: '.6rem .8rem',
  color: '#e5e7eb',
  textAlign: 'left',
  cursor: 'pointer',
};
