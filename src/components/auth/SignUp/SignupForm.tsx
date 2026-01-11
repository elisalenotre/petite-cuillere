// ------- Page d'authentification affichée pour la connexion ou l'inscription --------
// Affiche un formulaire d'inscription avec gestion des erreurs et succès.

import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../supabase';

export function SignupForm() {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // États pour les champs du formulaire et messages d'état
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Soumission du formulaire d'inscription
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    try {
      await signUpWithEmail(email, password);
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname as string | undefined;
        navigate(from ?? '/recipes', { replace: true });
      } else {
        setFormSuccess(
          'Regardez vos mails et confirmez votre adresse email pour pouvoir commencer à cuisiner, chef.fe'
        );
      }
    } catch (error: unknown) {
      const message = typeof error === 'string' ? error : (error as { message?: string }).message;
      setFormError(message ?? 'Une erreur est survenue');
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
          autoComplete="new-password"
          placeholder='Choisir un mot passe avec au moins 6 caractères.'
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
        {submitting ? 'Veuillez patienter… Nous cuisinons…' : "Créer un compte"}
      </button>
    </form>
  );
}
