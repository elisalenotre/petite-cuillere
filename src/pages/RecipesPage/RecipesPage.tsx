import { useEffect, useState } from "react";
import { getRecipes, deleteRecipe } from "../../services/recipesService";
import type { Recipe } from "../../types/recipes";

import SearchBar from "../../components/recipes/searchBar";
import RecipesList from "../../components/recipes/RecipesList";
import Pagination from "../../components/recipes/Pagination";
import "./RecipesPage.css"
  
export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;

  // Charger les recettes depuis Supabase
  async function loadRecipes() {
    try {
      const { recipes, total } = await getRecipes(page, pageSize);
      setRecipes(recipes);
      setTotal(total);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, [page]);

  // Suppression d’une recette
  async function handleDelete(id: string) {
    const confirmDelete = confirm("Supprimer cette recette ?");
    if (!confirmDelete) return;

    try {
      await deleteRecipe(id);
      loadRecipes();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  }

  // Filtrage local par recherche
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipes-page">
      {/* --- En-tête avec titre --- */}
      <div className="recipes-header">
        <h1 className="recipes-title">Mes Recettes</h1>
      </div>

      {/* --- Barre de recherche + bouton créer --- */}
      <div className="recipes-search-wrapper">
        <SearchBar search={search} setSearch={setSearch} />
        <a href="/recipes/create" className="recipes-create-btn">
          Créer une recette
        </a>
      </div>


      {/* --- Liste des recettes --- */}
      <div className="recipes-list">
        <RecipesList recipes={filteredRecipes} onDelete={handleDelete} />
      </div>

      {/* --- Pagination --- */}
      <div className="recipes-pagination">
        <Pagination
          page={page}
          setPage={setPage}
          total={total}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
