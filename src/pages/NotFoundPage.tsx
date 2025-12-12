import { Link } from 'react-router-dom';
import './NotFoundPage.css';
import spoonLogo from '../assets/spoon.svg';

// ------- Page d'erreur 404 affichée lorsque la route n'existe pas. --------
// Affiche un message d'erreur et un bouton pour revenir à la page d'accueil.
export function NotFoundPage() {
  return (
    <main className="notfound-page">
      <div className="notfound-layout">
        <header className="notfound-header">
          <img src={spoonLogo} alt="" className="notfound-logo" />
          <h1 className="notfound-title">Petite Cuillère</h1>
        </header>

        <section className="notfound-card">
          <h2 className="notfound-heading">Oups, cette page est introuvable</h2>
          <p className="notfound-text">
            On dirait que tu t'es emmêlé·e les cuillères. Ce n'est pas bien grave, retourne en cuisine !
          </p>

          <Link to="/" className="notfound-button">
            Retourner en cuisine
          </Link>
        </section>
      </div>
    </main>
  );
}
