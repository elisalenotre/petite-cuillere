import { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipes";

import RecipesList from "../../components/recipes/RecipeList/RecipesList";
import Pagination from "../../components/recipes/Pagination/Pagination";
import Filters from "../../components/recipes/Filters/Filters";
import RecipeForm from "../../components/recipes/RecipeForm/RecipeForm";

import { supabase } from "../../supabase";
import styles from "./RecipesPage.module.css";
import { deleteRecipe } from "../../services/recipesService";

import type { SortValue } from "../../components/recipes/Filters/Filters";
import SearchBar from "../../components/recipes/SearchBar/searchBar";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    let query: any = supabase
      .from("recettes")
      .select("*, categories(*)", { count: "exact" });

    if (search.trim() && typeof query.ilike === "function") {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    if (selectedFilters.regime && typeof query.eq === "function") {
      query = query.eq("categories.regime", selectedFilters.regime);
    }
    if (selectedFilters.temps && typeof query.eq === "function") {
      query = query.eq("categories.temps", selectedFilters.temps);
    }
    if (selectedFilters.tech_cuisson && typeof query.eq === "function") {
      query = query.eq("categories.tech_cuisson", selectedFilters.tech_cuisson);
    }
    if (selectedFilters.difficulty && typeof query.eq === "function") {
      query = query.eq("categories.difficulty", selectedFilters.difficulty);
    }

    let needsLocalSort = false;
    if (typeof query.order === "function") {
      switch (sort) {
        case "alpha-asc":
          query = query.order("title", { ascending: true, nullsFirst: false });
          break;
        case "alpha-desc":
          query = query.order("title", { ascending: false, nullsFirst: false });
          break;
        case "date-asc":
          query = query.order("created_at", { ascending: true });
          break;
        case "date-desc":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }
    } else {
      needsLocalSort = true;
    }

    const { data, error, count } = await query.range(from, from + pageSize - 1);

    if (error) {
      setErrorMsg("Erreur lors du chargement des recettes.");
      return;
    }

    let rows = data ?? [];
    if (needsLocalSort && rows.length) {
      rows = [...rows].sort((a: any, b: any) => {
        switch (sort) {
          case "alpha-asc":
            return a.title.localeCompare(b.title);
          case "alpha-desc":
            return b.title.localeCompare(a.title);
          case "date-asc":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "date-desc":
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
    }

    setRecipes(rows);
    setErrorMsg(null);
    setTotal(count ?? 0);
  }

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedFilters, sort]);

  // -----------------------------
  // Suppression d'une recette
  // -----------------------------
  async function handleDelete(recettes_id: string) {
    const confirmDelete = window.confirm("Souhaitez vous supprimer cette recette, chef.fe ?");
    if (!confirmDelete) return;

    try {
      await deleteRecipe(String(recettes_id));

      setRecipes((prev) =>
        prev.filter((r) => r.recettes_id !== recettes_id)
      );
    } catch (error) {
      setErrorMsg("Erreur lors de la suppression.");
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

  // Les recettes sont déjà filtrées/triées côté serveur
  const sortedRecipes = recipes;


  // -----------------------------
  // Ajout recette
  // -----------------------------
  const handleRecipeAdded = (recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
    setTotal((t) => t + 1);
  };

  // Remise en page 1 lors des changements de recherche/filtre/tri
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
  <div className={styles.recipesPage}>
    <div className={styles.recipesHeader}>
      <h1 className={styles.recipesTitle}>Les Recettes</h1>
    </div>

    <div className={styles.recipesTopBar}>
      <div className={styles.recipesSearchBox}>
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
        <SearchBar search={search} setSearch={handleSearchChange} />

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