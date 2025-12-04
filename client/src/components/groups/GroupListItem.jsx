import PinnedToggle from './PinnedToggle';

export default function GroupListItem({ group, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '.6rem .7rem',
        borderRadius: '.5rem',
        border: '1px solid #111827',
        background: active ? '#111827' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{group.name}</div>
        <div style={{ fontSize: '.8rem', color: '#9ca3af' }}>
          {group.memberCount} members
        </div>
      </div>

      <PinnedToggle groupId={group._id} />
    </button>
  );
}
