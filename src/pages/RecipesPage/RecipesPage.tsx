import { useEffect, useState } from "react";
import { getRecipes, deleteRecipe } from "../../services/recipesService";
import type { Recipe } from "../../types/recipes";

import SearchBar from "../../components/recipes/searchBar";
import RecipesList from "../../components/recipes/RecipesList";
import Pagination from "../../components/recipes/Pagination";
import Filters from "../../components/recipes/Filters";
import RecipeForm from "../../components/recipes/RecipeForm";

import { supabase } from "../../supabase";
import "./RecipesPage.css";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedFilters, setSelectedFilters] = useState({
    regime: "",
    temps: "",
    tech_cuisson: "",
    difficulty: "",
  });

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;

  const [showModal, setShowModal] = useState(false);

  // --- Chargement des recettes avec jointure sur categories
  async function loadRecipes() {
    try {
      const from = (page - 1) * pageSize;
      const { data, error, count } = await supabase
        .from("recettes")
        .select("*, categories(*)", { count: "exact" })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error("Erreur Supabase :", error);
        return;
      }

      setRecipes(data ?? []);
      setTotal(count ?? 0);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  }

  async function loadCategories() {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Erreur chargement catégories :", error);
    } else {
      setCategories(data ?? []);
    }
  }

  useEffect(() => {
    loadRecipes();
    loadCategories();
  }, [page]);

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

  const filterOptions = {
    regime: ["Végétarien", "Vegan", "Sans gluten"],
    temps: ["Rapide", "Moins de 30 min", "Plus d'1h"],
    tech_cuisson: ["Four", "Poêle", "Vapeur", "Sans cuisson"],
    difficulty: ["Facile", "Intermédiaire", "Difficile"],
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const cat = r.categories;

    const matchFilters =
      (!selectedFilters.regime || cat?.regime === selectedFilters.regime) &&
      (!selectedFilters.temps || cat?.temps === selectedFilters.temps) &&
      (!selectedFilters.tech_cuisson || cat?.tech_cuisson === selectedFilters.tech_cuisson) &&
      (!selectedFilters.difficulty || cat?.difficulty === selectedFilters.difficulty);

    return matchSearch && matchFilters;
  });

  const handleRecipeAdded = (recipe: Recipe) => {
    setRecipes([recipe, ...recipes]);
  };

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1 className="recipes-title">Mes Recettes</h1>
      </div>

      <div className="recipes-top-bar">
        <div className="recipes-search-box">
          <SearchBar search={search} setSearch={setSearch} />
          <Filters
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            options={filterOptions}
          />
        </div>

        <div className="recipes-create-wrapper">
          <button className="recipes-create-btn" onClick={() => setShowModal(true)}>
            Créer une recette
          </button>
        </div>
      </div>

      <div className="recipes-list">
        <RecipesList recipes={filteredRecipes} onDelete={handleDelete} />
      </div>

      <div className="recipes-pagination">
        <Pagination page={page} setPage={setPage} total={total} pageSize={pageSize} />
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <RecipeForm
              onClose={() => setShowModal(false)}
              onRecipeAdded={handleRecipeAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
}
