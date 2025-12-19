import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setError(null);
    try {
      await signOut();
    } catch {
      setError("Impossible de se déconnecter.");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-title" onClick={() => navigate("/")}>Petite Cuillère</span>
      </div>

      <div className="navbar-right">
        {error && <p className="navbar-error">{error}</p>}

        <button className="navbar-logout-btn" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </header>
  );
}
