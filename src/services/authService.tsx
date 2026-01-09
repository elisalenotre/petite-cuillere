// ------- Service d'authentification pour la connexion, l'inscription et la déconnexion --------
// Fournit des fonctions pour gérer l'inscription, la connexion, la déconnexion et la connexion via Google.

import { supabase } from '../supabase';

function mapAuthError(error: any): string {
  const status = (error?.status ?? error?.code) as number | string | undefined;
  const msg = String(error?.message ?? '').toLowerCase();

  if (typeof status === 'number') {
    switch (status) {
      case 400:
        return 'Identifiants invalides. Vérifiez votre email et mot de passe.';
      case 401:
        return "Accès non autorisé. Vérifiez la clé projet ou vos identifiants.";
      case 422:
        return 'Email non confirmé ou données invalides.';
      case 429:
        return 'Trop de tentatives. Réessayez dans quelques minutes.';
      case 500:
        return "Erreur interne du service d'authentification Supabase. Vérifiez les réglages Auth (Email/Password) et les logs côté Supabase.";
      default:
        break;
    }
  }

  if (msg.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Regardez vos mails et confirmez votre adresse email pour pouvoir commencer à cuisiner, chef.fe';
  }

  return "Une erreur est survenue lors de l'authentification.";
}

// Inscription avec email et mot de passe
export async function signUpWithEmailService(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[Auth] signUp error:', { status: (error as any)?.status, message: error.message, name: error.name });
    throw new Error(mapAuthError(error));
  }
}

// Connexion avec email et mot de passe
export async function signInWithEmailService(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[Auth] signIn error:', { status: (error as any)?.status, message: error.message, name: error.name });
    throw new Error(mapAuthError(error));
  }
}

// Déconnexion de l'utilisateur
export async function signOutService() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[Auth] signOut error:', { status: (error as any)?.status, message: error.message, name: error.name });
    throw new Error(mapAuthError(error));
  }
}

// Connexion via Google OAuth
export async function signInWithGoogleService() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: "http://localhost:5173/recipes",
    },
  });
  if (error) throw error;
}

// Connexion via GitHub OAuth
export async function signInWithGitHubService() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: "http://localhost:5173/recipes",
    },
  });
  if (error) throw error;
}

