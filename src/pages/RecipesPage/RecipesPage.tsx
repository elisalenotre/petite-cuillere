// ------- Page des recettes --------
// Liste, recherche, filtres, tri, pagination, ajout et suppression.
import { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipes";

import RecipesList from "../../components/recipes/RecipeList/RecipesList";
import Pagination from "../../components/recipes/Pagination/Pagination";
import Filters from "../../components/recipes/Filters/Filters";
import RecipeForm from "../../components/recipes/RecipeForm/RecipeForm";

import styles from "./RecipesPage.module.css";
import * as recipesService from "../../services/recipesService";
import { supabase } from "../../supabase";

import type { SortValue } from "../../components/recipes/Filters/Filters";
import SearchBar from "../../components/recipes/SearchBar/searchBar";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedFilters, setSelectedFilters] = useState({
    owner: "",
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
    try {
      // Utilise le service si disponible, sinon fallback simple (utile en tests où le module est partiellement mocké)
      const listFn = typeof recipesService.getRecipesWithClient === "function"
        ? recipesService.getRecipesWithClient
        : async (client: typeof supabase, params: { page: number; pageSize: number }) => {
            const from = (params.page - 1) * params.pageSize;
            const to = from + params.pageSize - 1;
            const { data, error, count } = await client
              .from("recettes")
              .select("*, categories(*)", { count: "exact" })
              .range(from, to);
            if (error) throw new Error("Erreur lors du chargement des recettes.");
            return { recipes: (data ?? []) as Recipe[], total: count ?? 0 };
          };

      const { recipes: rows, total } = await listFn(supabase, {
        page,
        pageSize,
        search,
        filters: selectedFilters,
        sort,
      });
      setRecipes(rows);
      setErrorMsg(null);
      setTotal(total);
    } catch {
      setErrorMsg("Erreur lors du chargement des recettes.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecipes();
  }, [page, search, selectedFilters, sort]);

  // Remise en page 1 lors des changements de filtres/tri
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [selectedFilters, sort]);

  // -----------------------------
  // Suppression d'une recette
  // -----------------------------
  async function handleDelete(recettes_id: string) {
    const confirmDelete = window.confirm("Souhaitez vous supprimer cette recette, chef.fe ?");
    if (!confirmDelete) return;

    try {
      await recipesService.deleteRecipe(String(recettes_id));

      setRecipes((prev) =>
        prev.filter((r) => r.recettes_id !== recettes_id)
      );
    } catch {
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

  const sortedRecipes = Array.isArray(recipes) ? recipes : [];


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
      {sortedRecipes.length === 0 ? (
        <p className={styles.emptyMsg}>
          Oops, il n'y a pas encore de recette par ici, chef.fe.
        </p>
      ) : (
        <RecipesList recipes={sortedRecipes} onDelete={handleDelete} />
      )}
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