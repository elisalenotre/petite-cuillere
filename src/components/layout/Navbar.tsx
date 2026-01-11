// ------- Barre de navigation --------
// Logo, titre et bouton de déconnexion pour utilisateur connecté.
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import spoonLogo from "../../assets/spoon.svg";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { signOut, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    null;

  const handleLogout = async () => {
    setError(null);
    try {
      await signOut();
    } catch {
      setError("Impossible de se déconnecter.");
    }
  };

  return (
    <header className={styles.navbar}>
      <Link to="/recipes" className={styles.navbarBrand} aria-label="Aller aux recettes">
        <img src={spoonLogo} alt="" className={styles.navbarLogo} />
        <span className={styles.navbarTitle}>Petite Cuillère</span>
      </Link>

      <div className={styles.navbarRight}>
        {displayName && (
          <span className={styles.navbarUser} aria-label="Utilisateur connecté">Salut chef.fe {displayName} !</span>
        )}
        {error && <p className={styles.navbarError}>{error}</p>}

        <button className={styles.navbarLogoutBtn} onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </header>
  );
}
