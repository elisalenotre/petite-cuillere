import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/auth/Login/LoginForm';
import { SignupForm } from '../../components/auth/SignUp/SignupForm';
import styles from './AuthPage.module.css';
import spoonLogo from '../../assets/spoon.svg';

export function AuthPage() {
  const { signInWithGoogle, signInWithGitHub, signOut, loading, user } = useAuth();
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

  const handleLogout = async () => {
    setGlobalError(null);
    try {
      await signOut();
    } catch {
      setGlobalError('Impossible de se déconnecter.');
    }
  };

  if (loading) {
    return <p className={styles['auth-loading']}>Chargement de la session... Nous cuisinons...</p>;
  }

  if (user) {
    return (
      <main className={styles['auth-page']}>
        <div className={styles['auth-layout']}>
          <header className={styles['auth-header']}>
            <img src={spoonLogo} alt="" className={styles['auth-logo']} />
            <h1 className={styles['auth-title']}>Petite Cuillère</h1>
          </header>

          <section className={`${styles['auth-card']} ${styles['auth-card--logged']}`}>
            <p>Tu es connecté·e en tant que {user.email}</p>

            {globalError && <p className={styles['auth-global-error']}>{globalError}</p>}

            <button onClick={handleLogout} className={styles['auth-logout-btn']}>
              Se déconnecter
            </button>
          </section>
        </div>
      </main>
    );
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
