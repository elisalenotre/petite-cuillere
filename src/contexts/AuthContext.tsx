// ------- Contexte d'authentification global pour l'application --------
// Fournit l'utilisateur, la session, l'état de chargement et les fonctions d'authentification.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../supabase';
import type { Session, User } from '@supabase/supabase-js';
import { signInWithEmailService, signUpWithEmailService, signOutService, signInWithGoogleService, signInWithGitHubService } from '../services/authService';

// Type du contexte d'authentification
type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
};

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ------- Fournisseur du contexte d'authentification --------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupère la session au chargement et écoute les changements d'authentification
  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Abonnement aux changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonctions d'authentification
  const signUpWithEmail = async (email: string, password: string) => {
    await signUpWithEmailService(email, password);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailService(email, password);
  };

  const signOut = async () => {
    await signOutService();
  };

  const signInWithGoogle = async () => {
    await signInWithGoogleService();
  };

  const signInWithGitHub = async () => {
    await signInWithGitHubService();
  }

  // Valeur du contexte
  const value: AuthContextType = {
    user,
    session,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
  };

  // Fournit le contexte aux enfants
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ------- Hook personnalisé pour utiliser le contexte d'authentification --------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
