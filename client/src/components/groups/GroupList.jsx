import GroupListItem from "./GroupListItem";

export default function GroupList({ groups, activeGroupId, onSelect, search }) {
  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
      {filtered.map(group => (
        <GroupListItem
          key={group._id}
          group={group}
          active={activeGroupId === group._id}
          onClick={() => onSelect(group)}
        />
      ))}
    </div>
  );
}
