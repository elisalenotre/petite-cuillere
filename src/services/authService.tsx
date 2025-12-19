// ------- Service d'authentification pour la connexion, l'inscription et la déconnexion --------
// Fournit des fonctions pour gérer l'inscription, la connexion, la déconnexion et la connexion via Google.

import { supabase } from '../supabase';

// Inscription avec email et mot de passe
export async function signUpWithEmailService(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

// Connexion avec email et mot de passe
export async function signInWithEmailService(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// Déconnexion de l'utilisateur
export async function signOutService() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
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
