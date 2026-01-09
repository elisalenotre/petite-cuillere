// ------- Page d'authentification affichée pour la connexion ou l'inscription --------
// Affiche un formulaire de connexion, d'inscription, ou l'état connecté selon l'utilisateur.

import { type FormEvent, useState, useCallback, type ChangeEvent, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export function LoginForm() {
  const { signInWithEmail } = useAuth();

  // États pour les champs du formulaire et les messages d'état
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Validation du formulaire
  const validateForm = () => {
    if (!email.includes('@')) {
      setFormError('Email invalide');
      return false;
    }
    if (password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  // Mettre les messages d'erreur appropriés selon le type d'erreur
  const getErrorMessage = (error: any) => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email ou mot de passe incorrect';
      case 'Email not confirmed':
        return 'Veuillez vérifier votre email';
      default:
        return 'Une erreur est survenue lors de la connexion';
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    // Validation du formulaire avant l'envoi
    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      await signInWithEmail(email, password);
      setFormSuccess('Connexion réussie ! Vous pouvez cuisiner !');
    } catch (error: any) {
      setFormError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  // Éviter les re-renders inutiles
  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  // Nettoyage des états sensibles
  useEffect(() => {
    return () => {
      setPassword('');
    };
  }, []);

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Champ email */}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
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
