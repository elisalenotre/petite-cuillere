import type { Recipe } from "../../types/recipes";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Recipe[];
  onDelete: (id: string) => void;
};

export default function RecipesList({ recipes, onDelete }: Props) {
  return (
    <>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.recettes_id}
          recipe={recipe}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}