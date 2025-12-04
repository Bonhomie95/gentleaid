import { X } from 'lucide-react';

export default function MobileMenu({
  onClose,
  onOpenHelp,
  onOpenProfile,
  onOpenDonate,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 48,
        right: 8,
        background: '#020617',
        border: '1px solid #1f2937',
        borderRadius: '.5rem',
        padding: '.75rem',
        minWidth: '180px',
        zIndex: 50,
      }}
    >
      <button style={item} onClick={onOpenHelp}>
        Request Help
      </button>
      <button style={donateBtn} onClick={onOpenDonate}>
        Donate
      </button>
      <button style={item} onClick={onOpenProfile}>
        Profile
      </button>

      <button style={item} onClick={onClose}>
        <X size={16} /> Close
      </button>
    </div>
  );
}

const item = {
  display: 'block',
  width: '100%',
  background: 'transparent',
  border: 'none',
  color: 'white',
  textAlign: 'left',
  padding: '.4rem',
  cursor: 'pointer',
};

const donateBtn = {
  ...item,
  background: '#22c55e',
  color: '#111',
  borderRadius: '.4rem',
};
