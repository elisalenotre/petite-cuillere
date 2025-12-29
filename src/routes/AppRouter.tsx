import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Navbar from "../components/layout/Navbar";

import { AuthPage } from "../pages/AuthPage/AuthPage";
import RecipesPage from "../pages/RecipesPage/RecipesPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { RequireAuth } from "../components/auth/RequireAuth";

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Chargement de l'application...</p>;
  }

  return (
    <BrowserRouter>
      {user && <Navbar />}

      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/recipes"
          element={
            <RequireAuth>
              <RecipesPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
