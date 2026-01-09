import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import type { Recipe } from "../../types/recipes";
import RecipeForm from "../../components/recipes/RecipeForm/RecipeForm";
import styles from "./RecipesDetails.module.css";

export default function RecipesDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecipe() {
      if (!id) return;

      

      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const { data, error } = await supabase
        .from("recettes")
        .select("*, categories(*)")
        .eq("recettes_id", id)
        .single();

      if (error) {
        setErrorMsg("Erreur lors du chargement de la recette.");
      } else {
        setRecipe(data);
      }

      setLoading(false);
    }

    loadRecipe();
  }, [id]);

  // Fonction pour rafraîchir après modification
  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    
    // Forcer un nouveau rendu avec un nouvel objet
    setRecipe({ ...updatedRecipe });
    setShowEditModal(false);
  };

  // Fonction pour supprimer la recette
  const handleDelete = async () => {
    if (!recipe || !id) return;

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la recette "${recipe.title}" ?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("recettes")
        .delete()
        .eq("recettes_id", id);

      if (error) {
        setErrorMsg("Erreur lors de la suppression de la recette.");
        alert("Erreur lors de la suppression de la recette");
      } else {
        // Rediriger vers la liste des recettes
        navigate("/recipes");
      }
    } catch (err) {
      setErrorMsg("Une erreur inattendue s'est produite.");
      alert("Une erreur inattendue s'est produite");
    }
  };

  if (loading) {
    return (
      <div className={styles.recipeDetailsPage}>
        <p>Chargement... Nous cuisinons votre recette...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className={styles.recipeDetailsPage}>
        <p>Recette introuvable</p>
        <Link to="/recipes" className={styles.backBtn}>
          ← Retour aux recettes
        </Link>
      </div>
    );
  }

  // Vérifier si l'utilisateur est le propriétaire
  const isOwner = currentUserId && recipe && currentUserId === recipe.user_id;

  return (
    <div className={styles.recipeDetailsPage}>
      <div className={styles.recipeDetailsContainer}>
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
        {/* Header avec titre */}
        <div className={styles.recipeDetailsHeader}>
          <h1 className={styles.recipeDetailsTitle}>{recipe.title}</h1>
        </div>

        {/* Image */}
        {recipe.img && (
          <div className={styles.recipeDetailsImageWrapper}>
            <img
              src={recipe.img}
              alt={recipe.title}
              className={styles.recipeDetailsImage}
            />
          </div>
        )}

        {/* Description/Déroulé */}
        {recipe.description && (
          <div className={styles.recipeDetailsSection}>
            <h2 className={styles.recipeDetailsSectionTitle}>Déroulé de la recette</h2>
            <p className={styles.recipeDetailsDescription}>{recipe.description}</p>
          </div>
        )}

        {/* Catégories */}
        {recipe.categories && (
          <div className={styles.recipeDetailsSection}>
            <h2 className={styles.recipeDetailsSectionTitle}>Informations</h2>
            <div className={styles.recipeDetailsCategories}>
              <div className={styles.recipeDetailItem}>
                <span className={styles.detailLabel}>Technique de cuisson :</span>
                <span className={styles.detailValue}>{recipe.categories.tech_cuisson}</span>
              </div>
              <div className={styles.recipeDetailItem}>
                <span className={styles.detailLabel}>Régime :</span>
                <span className={styles.detailValue}>{recipe.categories.regime}</span>
              </div>
              <div className={styles.recipeDetailItem}>
                <span className={styles.detailLabel}>Temps :</span>
                <span className={styles.detailValue}>{recipe.categories.temps}</span>
              </div>
              <div className={styles.recipeDetailItem}>
                <span className={styles.detailLabel}>Difficulté :</span>
                <span className={styles.detailValue}>{recipe.categories.difficulty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className={styles.recipeDetailsActions}>
          <Link to="/recipes" className={styles.backBtn}>
            ← Retour aux recettes
          </Link>
          {isOwner && (
            <>
              <button onClick={() => setShowEditModal(true)} className={styles.editBtn}>
                Modifier
              </button>
              <button onClick={handleDelete} className={styles.deleteBtn}>
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de modification - uniquement pour le propriétaire */}
      {showEditModal && isOwner && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <RecipeForm
              onClose={() => setShowEditModal(false)}
              onRecipeAdded={handleRecipeUpdated} 
              existingRecipe={recipe}
            />
          </div>
        </div>
      )}
    </div>
  );
}



