import { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipes";

import SearchBar from "../../components/recipes/SearchBar/searchBar";
import RecipesList from "../../components/recipes/RecipeList/RecipesList";
import Pagination from "../../components/recipes/Pagination/Pagination";
import Filters from "../../components/recipes/Filters/Filters";
import RecipeForm from "../../components/recipes/RecipeForm/RecipeForm";

import { supabase } from "../../supabase";
import styles from "./RecipesPage.module.css";
import { deleteRecipe } from "../../services/recipesService";

import type { SortValue } from "../../components/recipes/Filters/Filters";

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
  async function handleDelete(recettes_id: string) {
    const confirmDelete = window.confirm("Supprimer cette recette ?");
    if (!confirmDelete) return;

    try {
      await deleteRecipe(String(recettes_id));

      setRecipes((prev) =>
        prev.filter((r) => r.recettes_id !== recettes_id)
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
  <div className={styles.recipesPage}>
    <div className={styles.recipesHeader}>
      <h1 className={styles.recipesTitle}>Les Recettes</h1>
    </div>

    <div className={styles.recipesTopBar}>
      <div className={styles.recipesSearchBox}>
        <SearchBar search={search} setSearch={setSearch} />

        <Filters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          options={filterOptions}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div className={styles.recipesCreateWrapper}>
        <button
          className={styles.recipesCreateBtn}
          onClick={() => setShowModal(true)}
        >
          Créer une recette
        </button>
      </div>
    </div>

    <div className={styles.recipesList}>
      <RecipesList recipes={sortedRecipes} onDelete={handleDelete} />
    </div>

    <div className={styles.recipesPagination}>
      <Pagination page={page} setPage={setPage} total={total} pageSize={pageSize} />
    </div>

    {showModal && (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <RecipeForm onClose={() => setShowModal(false)} onRecipeAdded={handleRecipeAdded} />
        </div>
      </div>
    )}
  </div>
);
}