import { useState } from 'react';

export default function PinnedToggle({ groupId }) {
  const [pinned, setPinned] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('pinnedGroups') || '[]');
    return saved.includes(groupId);
  });

  const toggle = () => {
    const saved = JSON.parse(localStorage.getItem('pinnedGroups') || '[]');
    let updated;
    if (pinned) updated = saved.filter((id) => id !== groupId);
    else updated = [...saved, groupId];
    localStorage.setItem('pinnedGroups', JSON.stringify(updated));
    setPinned(!pinned);
  };

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      style={{ cursor: 'pointer' }}
    >
      {pinned ? '⭐' : '☆'}
    </span>
  );
}
