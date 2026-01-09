import { Link } from "react-router-dom";
import type { Recipe } from "../../../types/recipes";

type Props = {
  recipe: Recipe;
  onDelete: (id: string) => void;
  currentUserId: string | null; // Ajout du userId
};

export default function RecipeCard({ recipe, onDelete, currentUserId }: Props) {

  // Vérifier si l'utilisateur est le propriétaire
  const isOwner = currentUserId && currentUserId === recipe.user_id;

  return (
    <div className="recipe-card">
      <img src={recipe.img || undefined} alt={recipe.title} />

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
              <Link to={`/recipes/update/${recipe.recettes_id}`} title="Modifier">
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