import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupForm } from '../../components/auth/SignupForm';
import './AuthPage.css';
import spoonLogo from '../../assets/spoon.svg';

export function AuthPage() {
  const { signInWithGoogle, signOut, loading, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // afficher un message d'erreur global
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // idem
    }
  };

  if (loading) {
    return <p className="auth-loading">Chargement de la session...Nous cuisinons...</p>;
  }

  if (user) {
    return (
      <main className="auth-page">
        <div className="auth-layout">
          <header className="auth-header">
            <img src={spoonLogo} alt="" className="auth-logo" />
            <h1 className="auth-title">Petite Cuillère</h1>
          </header>

          <section className="auth-card auth-card--logged">
            <p>Tu es connecté·e en tant que {user.email}</p>
            <button onClick={handleLogout} className="auth-logout-btn">
              Se déconnecter
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <header className="auth-header">
          <img src={spoonLogo} alt="" className="auth-logo" />
          <h1 className="auth-title">Petite Cuillère</h1>
        </header>

        <section className="auth-card">
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

          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogle}
          >
            Continuer avec Google
          </button>
        </section>
      </div>
    </main>
  );
}
