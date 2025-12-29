import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

// ------- Page d'erreur 404 affichée lorsque la route n'existe pas. --------
// Affiche un message d'erreur et un bouton pour revenir à la page d'accueil.
export function NotFoundPage() {
  return (
    <main className={styles.notfoundPage}>
      <div className={styles.notfoundLayout}>

        <section className={styles.notfoundCard}>
          <h2 className={styles.notfoundHeading}>
            Oups, cette page est introuvable
          </h2>

          <p className={styles.notfoundText}>
            On dirait que tu t'es emmêlé·e les cuillères.
            Ce n'est pas bien grave, retourne en cuisine !
          </p>

          <Link to="/recipes" className={styles.notfoundButton}>
            Retourner en cuisine
          </Link>
        </section>

      </div>
    </main>
  );
}
