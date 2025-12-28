import { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipes";

import SearchBar from "../../components/recipes/searchBar";
import RecipesList from "../../components/recipes/RecipesList";
import Pagination from "../../components/recipes/Pagination";
import Filters from "../../components/recipes/Filters";
import RecipeForm from "../../components/recipes/RecipeForm";

import { supabase } from "../../supabase";
import "./RecipesPage.css";
import { deleteRecipe } from "../../services/recipesService";

import type { SortValue } from "../../components/recipes/Filters";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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

  const [sort, setSort] = useState<SortValue>("date-desc");

  // -----------------------------
  // Chargement des recettes
  // -----------------------------
  async function loadRecipes() {
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
  }

  useEffect(() => {
    loadRecipes();
  }, [page]);

  // -----------------------------
  // Suppression d'une recette
  // -----------------------------
  async function handleDelete(recettes_id: number) {
    const confirmDelete = window.confirm("Supprimer cette recette ?");
    if (!confirmDelete) return;

    try {
      await deleteRecipe(recettes_id);

      // Mise à jour immédiate du state (UX fluide)
      setRecipes((prev) =>
        prev.filter((r) => String(r.recettes_id) !== String(recettes_id))
      );
    } catch (error) {
      console.error("Erreur suppression :", error);
      alert("Erreur lors de la suppression");
    }
  }


  // -----------------------------
  // Options des filtres
  // -----------------------------
  const filterOptions = {
    regime: ["Végétarien", "Vegan", "Sans gluten"],
    temps: ["Rapide", "Moins de 30 min", "Plus d'1h"],
    tech_cuisson: ["Four", "Poêle", "Vapeur", "Sans cuisson"],
    difficulty: ["Facile", "Intermédiaire", "Difficile"],
  };

  // -----------------------------
  // Filtrage local
  // -----------------------------
  const filteredRecipes = recipes.filter((r) => {
    const matchSearch = r.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const cat = r.categories;

    const matchFilters =
      (!selectedFilters.regime || cat?.regime === selectedFilters.regime) &&
      (!selectedFilters.temps || cat?.temps === selectedFilters.temps) &&
      (!selectedFilters.tech_cuisson ||
        cat?.tech_cuisson === selectedFilters.tech_cuisson) &&
      (!selectedFilters.difficulty ||
        cat?.difficulty === selectedFilters.difficulty);

    return matchSearch && matchFilters;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sort) {
      case "alpha-asc":
        return a.title.localeCompare(b.title);
      case "alpha-desc":
        return b.title.localeCompare(a.title);
      case "date-asc":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "date-desc":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });


  // -----------------------------
  // Ajout recette
  // -----------------------------
  const handleRecipeAdded = (recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
  };

  return (
    <div className="recipes-page">
      {/* -------- Header -------- */}
      <div className="recipes-header">
        <h1 className="recipes-title">Mes Recettes</h1>
      </div>

      {/* -------- Recherche + filtres -------- */}
      <div className="recipes-top-bar">
        <div className="recipes-search-box">
          <SearchBar search={search} setSearch={setSearch} />

          <Filters
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            options={filterOptions}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {/* -------- Bouton création -------- */}
        <div className="recipes-create-wrapper">
          <button
            className="recipes-create-btn"
            onClick={() => setShowModal(true)}
          >
            Créer une recette
          </button>
        </div>
      </div>

      {/* -------- Liste -------- */}
      <div className="recipes-list">
        <RecipesList
          recipes={sortedRecipes}
          onDelete={handleDelete}
        />
      </div>

      {/* -------- Pagination -------- */}
      <div className="recipes-pagination">
        <Pagination
          page={page}
          setPage={setPage}
          total={total}
          pageSize={pageSize}
        />
      </div>

      {/* -------- Modal -------- */}
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
