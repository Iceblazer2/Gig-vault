import { useState } from "react";
import { workers } from "../data/workers";
import WorkerCard from "../components/WorkerCard";
import FilterBar from "../components/FilterBar";

export default function WorkerList() {
  const [query, setQuery] = useState("");

  const filteredWorkers = workers.filter(
    (w) =>
      w.skill.toLowerCase().includes(query.toLowerCase()) ||
      w.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2>Available Workers</h2>
      <FilterBar setQuery={setQuery} />

      <div className="grid">
        {filteredWorkers.map((w) => (
          <WorkerCard key={w.id} worker={w} />
        ))}
      </div>
    </div>
  );
}
