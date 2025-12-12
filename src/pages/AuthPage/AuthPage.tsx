import { type FormEvent, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';

export function AuthPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, loading, user } =
    useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        setFormSuccess('Connexion réussie ! Vous pouvez cuisiner 🍽️');
      } else {
        await signUpWithEmail(email, password);
        setFormSuccess(
          "Inscription réussie ! Vérifie tes mails si la confirmation est activée."
        );
      }
    } catch (error: any) {
      setFormError(error.message ?? 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormError(null);
    setFormSuccess(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setFormError(
        error.message ?? 'Erreur lors de la connexion avec Google'
      );
    }
  };

  const handleLogout = async () => {
    try {
        await signOut();
    } catch (error: any) {
        console.error('Erreur lors de la déconnexion :', error.message);
    }
};

  if (loading) {
    return <p className="auth-loading">Chargement de la session de cuisine...</p>;
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

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {formError && <p className="auth-error">{formError}</p>}
          {formSuccess && <p className="auth-success">{formSuccess}</p>}

          <button type="submit" disabled={submitting} data-testid="auth-submit-button">
            {submitting
              ? 'Veuillez patienter…'
              : mode === 'login'
              ? 'Se connecter'
              : "Créer un compte"}
          </button>
        </form>

        <div className="auth-separator">
          <span>ou</span>
        </div>

        <button type="button" className="auth-google-btn" onClick={handleGoogle}>
          Continuer avec Google
        </button>
      </div>
    </main>
  );
}
