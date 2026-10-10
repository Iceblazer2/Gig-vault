import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>GigWorker SafetyVault</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/workers">Workers</Link>
      </div>
    </nav>
  );
}
