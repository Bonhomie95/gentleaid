import { Sun, Moon, Menu } from 'lucide-react';

export default function MobileTopBar({ theme, toggleTheme, onMenuToggle }) {
  return (
    <div
      style={{
        padding: '.75rem 1rem',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        justifyContent: 'space-between',
        background: theme === 'dark' ? '#020617' : '#f3f4f6',
      }}
    >
      <span style={{ fontWeight: 700 }}>GentelAid</span>

      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button style={ic} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button style={ic} onClick={onMenuToggle}>
          <Menu size={18} />
        </button>
      </div>
    </div>
  );
}

const ic = {
  border: '1px solid #374151',
  background: 'transparent',
  borderRadius: '999px',
  padding: '.35rem',
  cursor: 'pointer',
};
