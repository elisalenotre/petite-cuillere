import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import spoonLogo from "../../assets/spoon.svg";
import "./Navbar.css";

export default function Navbar() {
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
        <img src={spoonLogo} alt="" className="navbar-logo" />
        <span className="navbar-title">Petite Cuillère</span>
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
