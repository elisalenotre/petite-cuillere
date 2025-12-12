import { type FormEvent, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const { signInWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    try {
      await signInWithEmail(email, password);
      setFormSuccess('Connexion réussie ! Vous pouvez cuisiner !');
    } catch (error: any) {
      setFormError(error.message ?? 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder='RemiRatatouille@email.com'
        />
      </label>

      <label>
        Mot de passe
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder='Choisir un mot passe avec au moins 6 caractères.'
        />
      </label>

      {formError && <p className="auth-error">{formError}</p>}
      {formSuccess && <p className="auth-success">{formSuccess}</p>}

      <button
        type="submit"
        disabled={submitting}
        data-testid="auth-submit-button"
      >
        {submitting ? 'Veuillez patienter… Nous cuisinons…' : 'Se connecter'}
      </button>
    </form>
  );
}
