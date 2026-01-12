// ------- Carte de recette --------
// Affiche une recette, ses catégories et actions (voir/modifier/supprimer).
import { Link } from "react-router-dom";
import type { Recipe } from "../../../types/recipes";

type Props = {
  recipe: Recipe;
  onDelete: (id: string) => void;
  currentUserId: string | null;
};

export default function RecipeCard({ recipe, onDelete, currentUserId }: Props) {

  // Vérifier si l'utilisateur est le propriétaire
  const isOwner = currentUserId && currentUserId === recipe.user_id;

  return (
    <div className="recipe-card">
      {recipe.img ? (
        <img src={recipe.img} alt={recipe.title} loading="lazy" />
      ) : (
        <div className="recipe-card-placeholder" aria-label="Image indisponible">
          <span className="emoji" aria-hidden="true">🍽️</span>
          <span>Pas encore d'image. A vous d'imaginer !</span>
        </div>
      )}

      <div className="recipe-card-content">
        <h2>{recipe.title}</h2>

        {recipe.categories && (
          <div className="recipe-card-categories">
            <p>{recipe.categories.tech_cuisson}</p>
            <p>{recipe.categories.regime}</p>
            <p>{recipe.categories.temps}</p>
            <p>{recipe.categories.difficulty}</p>
          </div>
        )}

        <div className="recipe-card-actions">
          {/* Bouton "Voir" toujours visible */}
          <Link to={`/recipes/${recipe.recettes_id}`} title="Voir la recette">
            Voir
          </Link>

          {/* Boutons "Modifier" et "Supprimer" uniquement pour le propriétaire */}
          {isOwner && (
            <>
              <Link to={`/recipes/${recipe.recettes_id}?edit=1`} title="Modifier">
                Modifier
              </Link>
              <button onClick={() => onDelete(recipe.recettes_id)} title="Supprimer">
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}