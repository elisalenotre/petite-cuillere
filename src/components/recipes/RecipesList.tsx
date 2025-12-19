import type { Recipe } from "../../types/recipes";

type Props = {
  recipes: Recipe[];
  onDelete: (id: number) => void;
};

export default function RecipesList({ recipes, onDelete }: Props) {
  return (
    <div className="recipes-grid">
      {recipes.map((recipe) => (
        <div key={recipe.recettes_id} className="recipe-card">
          <h3>{recipe.title}</h3>

          <button
            className="delete-btn"
            onClick={() => onDelete(recipe.recettes_id)}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
