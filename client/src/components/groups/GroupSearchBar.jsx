export default function GroupSearchBar({ search, setSearch }) {
  return (
    <input
      placeholder="Search groups..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: '90%',
        margin: '0 auto .8rem',
        display: 'block',
        padding: '.5rem',
        background: 'transparent',
        border: '1px solid #374151',
        color: 'inherit',
        borderRadius: '.4rem',
      }}
    />
  );
}
