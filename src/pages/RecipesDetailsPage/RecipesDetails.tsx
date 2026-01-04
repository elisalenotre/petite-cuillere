import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import type { Recipe } from "../../types/recipes";
import RecipeForm from "../../components/recipes/RecipeForm/RecipeForm";
import "./RecipesDetails.css";

export default function RecipesDetails() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false); 

  useEffect(() => {
    async function loadRecipe() {
      if (!id) return;

      console.log("🔍 ID recherché :", id);

      const { data, error } = await supabase
        .from("recettes")
        .select("*, categories(*)")
        .eq("recettes_id", id)
        .single();

      if (error) {
        console.error("❌ Erreur :", error);
      } else {
        console.log("✅ Recette trouvée :", data);
        setRecipe(data);
      }

      setLoading(false);
    }

    loadRecipe();
  }, [id]);

  // Fonction pour rafraîchir après modification
    const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    console.log("🔄 Mise à jour de la recette locale:", updatedRecipe);
    setRecipe(updatedRecipe);
    setShowEditModal(false);
    };

  if (loading) {
    return (
      <div className="recipe-details-page">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-details-page">
        <p>Recette introuvable</p>
        <Link to="/recipes" className="back-link">
          ← Retour aux recettes
        </Link>
      </div>
    );
  }

  return (
    <div className="recipe-details-page">
      <div className="recipe-details-container">
        {/* Header avec titre */}
        <div className="recipe-details-header">
          <h1 className="recipe-details-title">{recipe.title}</h1>
        </div>

        {/* Image */}
        {recipe.img && (
          <div className="recipe-details-image-wrapper">
            <img
              src={recipe.img}
              alt={recipe.title}
              className="recipe-details-image"
            />
          </div>
        )}

        {/* Description/Déroulé */}
        {recipe.description && (
          <div className="recipe-details-section">
            <h2 className="recipe-details-section-title">Déroulé de la recette</h2>
            <p className="recipe-details-description">{recipe.description}</p>
          </div>
        )}

        {/* Catégories */}
        {recipe.categories && (
          <div className="recipe-details-section">
            <h2 className="recipe-details-section-title">Informations</h2>
            <div className="recipe-details-categories">
              <div className="recipe-detail-item">
                <span className="detail-label">Technique de cuisson :</span>
                <span className="detail-value">{recipe.categories.tech_cuisson}</span>
              </div>
              <div className="recipe-detail-item">
                <span className="detail-label">Régime :</span>
                <span className="detail-value">{recipe.categories.regime}</span>
              </div>
              <div className="recipe-detail-item">
                <span className="detail-label">Temps :</span>
                <span className="detail-value">{recipe.categories.temps}</span>
              </div>
              <div className="recipe-detail-item">
                <span className="detail-label">Difficulté :</span>
                <span className="detail-value">{recipe.categories.difficulty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="recipe-details-actions">
          <Link to="/recipes" className="back-btn">
            ← Retour aux recettes
          </Link>
          <button onClick={() => setShowEditModal(true)} className="edit-btn">
            ✏️ Modifier
          </button>
        </div>
      </div>

      {/* Modal de modification */}
        {showEditModal && (
        <div className="modal-backdrop">
            <div className="modal-content">
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