import GroupSearchBar from './GroupSearchBar';
import GroupList from './GroupList';

export default function GroupSidebar({
  groups,
  activeGroupId,
  onSelect,
  search,
  setSearch,
}) {
  return (
    <div
      style={{
        width: 320,
        borderRight: '1px solid #1f2937',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ margin: '1rem', fontSize: '1.2rem' }}>Groups</h2>

      <GroupSearchBar search={search} setSearch={setSearch} />

      <GroupList
        groups={groups}
        search={search}
        activeGroupId={activeGroupId}
        onSelect={onSelect}
      />
    </div>
  );
}
