// ------- Page d'authentification affichée pour la connexion ou l'inscription --------
// Affiche un formulaire de connexion, d'inscription, ou l'état connecté selon l'utilisateur.

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupForm } from '../../components/auth/SignupForm';
import './AuthPage.css';
import spoonLogo from '../../assets/spoon.svg';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  // Récupère les fonctions d'authentification et l'état utilisateur depuis le contexte
  const { signInWithGoogle, signInWithGitHub, signOut, loading, user } = useAuth();
  // Gère le mode affiché : connexion ou inscription
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  // Gère l'affichage d'une erreur globale
  const [globalError, setGlobalError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Redirige si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/recipes');
    }
  }, [user, navigate]);

  // Connexion via Google
  const handleGoogle = async () => {
    setGlobalError(null);
    try {
      await signInWithGoogle();
    } catch {
      setGlobalError("Oups, la connexion avec Google a échoué.");
    }
  };

  // Connexion via GitHub
  const handleGitHub = async () => {
    setGlobalError(null);
    try {
      await signInWithGitHub();
    } catch {
      setGlobalError("Oups, la connexion avec GitHub a échoué.");
    }
  };



  // Déconnexion de l'utilisateur
  const handleLogout = async () => {
    setGlobalError(null);
    try {
      await signOut();
    } catch {
      setGlobalError("Impossible de se déconnecter.");
    }
  };

  // Affichage pendant le chargement de la session 
  if (loading) {
    return <p className="auth-loading">Chargement de la session... Nous cuisinons...</p>;
  }

  // Affichage du formulaire de connexion ou d'inscription
  return (
    <main className="auth-page">
      <div className="auth-layout">
        <header className="auth-header">
          <img src={spoonLogo} alt="Logo Petite Cuillère" className="auth-logo" />
          <h1 className="auth-title">Petite Cuillère</h1>
        </header>

        <section className="auth-card">
          {globalError && <p className="auth-global-error">{globalError}</p>}
          
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Se connecter
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              S'inscrire
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <SignupForm />}

          <div className="auth-separator">
            <span>ou</span>
          </div>

          <div className="auth-oauth">
            <button type="button" className="auth-google-btn" onClick={handleGoogle}>
              Continuer avec Google
            </button>

            <button type="button" className="auth-github-btn" onClick={handleGitHub}>
              Continuer avec GitHub
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}
