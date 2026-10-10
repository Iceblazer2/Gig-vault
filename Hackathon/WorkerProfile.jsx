import { useParams, Link } from "react-router-dom";
import { workers } from "../data/workers";

export default function WorkerProfile() {
  const { id } = useParams();
  const worker = workers.find((w) => w.id === parseInt(id));

  return (
    <div className="profile-page">
      <img src={worker.image} alt={worker.name} />
      <h2>{worker.name}</h2>
      <p>Skill: {worker.skill}</p>
      <p>Experience: {worker.experience}</p>
      <p>Rating: ⭐ {worker.rating}</p>
      <p>₹ {worker.price}</p>
      <p>{worker.description}</p>

      <Link to={`/book/${worker.id}`}>
        <button className="btn-main">Hire Now</button>
      </Link>
    </div>
  );
}
