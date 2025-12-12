import type { Recipe } from "../../types/recipes";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Recipe[];
  onDelete: (id: string) => void;
};

const RecipesList = ({ recipes, onDelete }: Props) => {
  if (recipes.length === 0)
    return <p>Aucune recette trouvée.</p>;

  return (
    <div>
      {recipes.map((r) => (
        <RecipeCard key={r.recette_id} recipe={r} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default RecipesList;
