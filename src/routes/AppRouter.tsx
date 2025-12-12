import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage/AuthPage';

import RecipesPage from '../../src/pages/RecipesPage/RecipesPage';
// import { RecipeDetailPage } from '../pages/RecipeDetailPage/RecipeDetailPage';
// import { NotFoundPage } from '../pages/NotFoundPage';
import { RequireAuth } from '../components/auth/RequireAuth';

export function AppRouter() {
  return (
    <BrowserRouter>
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

        <Route
        //   path="/recettes/:id"
        //   element={
        //     <RequireAuth>
        //       <RecipeDetailPage />
        //     </RequireAuth>
        //   }
        />

        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
