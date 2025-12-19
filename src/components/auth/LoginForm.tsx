// ------- Page d'authentification affichée pour la connexion ou l'inscription --------
// Affiche un formulaire de connexion, d'inscription, ou l'état connecté selon l'utilisateur.

import { type FormEvent, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const { signInWithEmail } = useAuth();

  // États pour les champs du formulaire et les messages d'état
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Gestion de la soumission du formulaire
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
      {/* Champ email */}
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

      {/* Champ mot de passe */}
      <label>
        Mot de passe
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder='Saisir son mot de passe'
        />
      </label>

      {/* Affichage des messages d'erreur ou de succès */}
      {formError && <p className="auth-error">{formError}</p>}
      {formSuccess && <p className="auth-success">{formSuccess}</p>}

      {/* Bouton de soumission */}
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
