// ------- Page d'authentification --------
// Onglets connexion/inscription, OAuth et redirection si connecté.
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/auth/Login/LoginForm';
import { SignupForm } from '../../components/auth/SignUp/SignupForm';
import styles from './AuthPage.module.css';
import spoonLogo from '../../assets/spoon.svg';

export function AuthPage() {
  const { signInWithGoogle, signInWithGitHub, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setGlobalError(null);
    try {
      await signInWithGoogle();
    } catch {
      setGlobalError('Oups, la connexion avec Google a échoué.');
    }
  };

  const handleGitHub = async () => {
    setGlobalError(null);
    try {
      await signInWithGitHub();
    } catch {
      setGlobalError('Oups, la connexion avec GitHub a échoué.');
    }
  };
  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as any)?.from?.pathname as string | undefined;
      navigate(from ?? '/recipes', { replace: true });
    }
  }, [loading, user, location, navigate]);

  if (loading) {
    return <p className={styles['auth-loading']}>Chargement de la session... Nous cuisinons...</p>;
  }

  if (user) {
    return <p className={styles['auth-loading']}>Redirection en cours... Nous cuisinons...</p>;
  }

  return (
    <main className={styles['auth-page']}>
      <div className={styles['auth-layout']}>
        <header className={styles['auth-header']}>
          <img src={spoonLogo} alt="" className={styles['auth-logo']} />
          <h1 className={styles['auth-title']}>Petite Cuillère</h1>
        </header>

        <section className={styles['auth-card']}>
          {globalError && <p className={styles['auth-global-error']}>{globalError}</p>}

          <div className={styles.authTabs} data-mode={mode}>
            <span className={styles.tabIndicator} aria-hidden="true" />

            <button
              type="button"
              className={`${styles.tabButton} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => setMode('login')}
            >
              Se connecter
            </button>

            <button
              type="button"
              className={`${styles.tabButton} ${mode === 'signup' ? styles.tabActive : ''}`}
              onClick={() => setMode('signup')}
            >
              S'inscrire
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <SignupForm />}

          <div className={styles['auth-separator']}>
            <span>ou</span>
          </div>

          <div className={styles['auth-oauth']}>
            <button type="button" className={styles['auth-google-btn']} onClick={handleGoogle}>
              Continuer avec Google
            </button>

            <button type="button" className={styles['auth-github-btn']} onClick={handleGitHub}>
              Continuer avec GitHub
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
