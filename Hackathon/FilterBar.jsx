export default function FilterBar({ setQuery }) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by skill or location..."
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
