import { useParams, useNavigate } from "react-router-dom";
import { workers } from "../data/workers";
import { useState } from "react";

export default function Booking() {
  const { id } = useParams();
  const worker = workers.find((w) => w.id === parseInt(id));
  const navigate = useNavigate();

  const [address, setAddress] = useState("");

  const handleBook = () => {
    navigate("/confirmation");
  };

  return (
    <div className="booking">
      <h2>Booking: {worker.name}</h2>
      <p>Price Locked Safely: ₹{worker.price}</p>

      <textarea
        placeholder="Enter your address"
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={handleBook} className="btn-main">
        Confirm & Lock Payment
      </button>
    </div>
  );
}
