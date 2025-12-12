import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupForm } from '../../components/auth/SignupForm';
import './AuthPage.css';

export function AuthPage() {
  const { signInWithGoogle, signOut, loading, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // gestion d'erreur
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // gestion d'erreur
    }
  };

  if (loading) {
    return <p className="auth-loading">Chargement de la session... Nous cuisinons...</p>;
  }

  if (user) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p>Tu es connecté·e en tant que {user.email}</p>
          <button onClick={handleLogout} className="auth-logout-btn">
            Se déconnecter
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
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

        {/* Le formulaire */}
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
      </div>
    </main>
  );
}
