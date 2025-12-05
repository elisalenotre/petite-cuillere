import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthPage } from './pages/AuthPage/AuthPage';
// plus tard : import { RecipesPage } from './pages/RecipesPage/RecipesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'authentification */}
        <Route path="/auth" element={<AuthPage />} />

        {/* TODO: plus tard : route protégée pour les recettes */}
        {/* <Route path="/" element={<RequireAuth><RecipesPage /></RequireAuth>} /> */}

        {/* fallback simple */}
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
