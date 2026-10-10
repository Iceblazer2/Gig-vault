import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <h1>Find Trusted Workers Near You</h1>
      <p>Secure hiring with Safety Vault Protection</p>

      <Link to="/workers">
        <button className="btn-main">Browse Workers</button>
      </Link>
    </div>
  );
}
