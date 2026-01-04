// ------- Composant RequireAuth pour protéger les routes privées --------
// Affiche un message de chargement, redirige vers /auth si l'utilisateur n'est pas connecté,
// ou affiche les enfants si l'utilisateur est authentifié.

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Affiche un message pendant la vérification de l'authentification
  if (loading) {
    return <p>Vérification de la connexion...</p>;
  }

  // Redirige vers la page d'authentification si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Affiche le contenu protégé si l'utilisateur est authentifié
  return <>{children}</>;
}
