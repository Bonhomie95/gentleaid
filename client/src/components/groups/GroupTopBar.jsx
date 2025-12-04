import { Sun, Moon } from "lucide-react";

export default function GroupTopBar({ theme, toggleTheme, onOpenHelp, onOpenProfile, onOpenDonate }) {
  return (
    <div style={{
      padding: '.75rem 1rem',
      borderBottom: '1px solid #1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button style={pillStyle} onClick={onOpenHelp}>Request Help</button>
        <button style={pillStyle} onClick={onOpenDonate}>Donate</button>
      </div>

      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button onClick={toggleTheme} style={iconStyle}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={onOpenProfile} style={iconStyle}>👤</button>
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

const iconStyle = {
  border: '1px solid #374151',
  borderRadius: '999px',
  padding: '.35rem',
  background: 'transparent',
  cursor: 'pointer',
};
