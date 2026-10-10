import { Link } from "react-router-dom";

export default function WorkerCard({ worker }) {
  return (
    <div className="worker-card">
      <img src={worker.image} alt={worker.name} />
      <h3>{worker.name}</h3>
      <p>{worker.skill}</p>
      <p>⭐ {worker.rating}</p>
      <p>₹ {worker.price}</p>

      <Link to={`/workers/${worker.id}`}>
        <button>View Profile</button>
      </Link>
    </div>
  );
}
