// ------- Liste des recettes --------
// Délègue chaque item à RecipeCard.
import type { Recipe } from "../../../types/recipes";
import RecipeCard from "../RecipeCard/RecipeCard";

type Props = {
  recipes: Recipe[];
  onDelete: (id: string) => void;
  currentUserId?: string | null;
};

export default function RecipesList({ recipes, onDelete, currentUserId = null }: Props) {
  return (
    <>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.recettes_id}
          recipe={recipe}
          onDelete={onDelete} currentUserId={currentUserId}
          />
      ))}
    </>
  );
}