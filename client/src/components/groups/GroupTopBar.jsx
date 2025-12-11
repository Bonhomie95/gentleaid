import { Sun, Moon } from 'lucide-react';

export default function GroupTopBar({
  theme,
  toggleTheme,
  onOpenHelp,
  onOpenProfile,
  onOpenDonate,
}) {
  return (
    <div
      style={{
        padding: '.75rem 1rem',
        borderBottom: `1px solid ${theme === 'dark' ? '#1f2937' : '#d1d5db'}`,
        background: theme === 'dark' ? '#0f172a' : '#f9fafb',
        color: theme === 'dark' ? '#e2e8f0' : '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button style={pillStyle} onClick={onOpenHelp}>
          Request Help
        </button>
        <button style={pillStyle} onClick={onOpenDonate}>
          Donate
        </button>
      </div>

      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button onClick={toggleTheme} style={iconStyle(theme)}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={onOpenProfile} style={iconStyle(theme)}>
          👤
        </button>
      </div>
    </div>
  );
}

const pillStyle = {
  padding: '.4rem .8rem',
  borderRadius: '999px',
  border: 'none',
  background: '#22c55e',
  color: '#020617',
  fontSize: '.8rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const iconStyle = (theme) => ({
  border: `1px solid ${theme === 'dark' ? '#374151' : '#d1d5db'}`,
  background: 'transparent',
  color: theme === 'dark' ? '#e2e8f0' : '#111',
  borderRadius: '999px',
  padding: '.35rem',
  cursor: 'pointer',
});
