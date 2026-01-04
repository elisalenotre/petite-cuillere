import { Link } from "react-router-dom";
import type { Recipe } from "../../types/recipes";

type Props = {
  recipe: Recipe;
  onDelete: (id: string) => void;
};

export default function RecipeCard({ recipe, onDelete }: Props) {
  console.log("🔍 Recipe dans card:", recipe);
  console.log("🆔 ID:", recipe.recettes_id);

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
          <Link to={`/recipes/${recipe.recettes_id}`} title="Voir la recette">
            Voir
          </Link>
          <Link to={`/recipes/update/${recipe.recettes_id}`} title="Modifier">
            Modifier
          </Link>
          <button onClick={() => onDelete(recipe.recettes_id)} title="Supprimer">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}