import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage/AuthPage";
import RecipesPage from "../pages/RecipesPage/RecipesPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { RequireAuth } from "../components/auth/RequireAuth/RequireAuth";
import RecipesDetails from "../pages/RecipesDetailsPage/RecipesDetails";

export default function AppRouter() {
  return (
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

      <Route path="/" element={<Navigate to="/recipes" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
