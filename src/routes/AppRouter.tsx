import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Navbar from "../components/layout/Navbar";

import { AuthPage } from "../pages/AuthPage/AuthPage";
import RecipesPage from "../pages/RecipesPage/RecipesPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { RequireAuth } from "../components/auth/RequireAuth";
import RecipesDetails from "../pages/RecipesDetailsPage/RecipesDetails";

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

         {/* ⬅️ Ajoutez cette route */}
        <Route
          path="/recipes/:id"
          element={
            <RequireAuth>
              <RecipesDetails />  
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
