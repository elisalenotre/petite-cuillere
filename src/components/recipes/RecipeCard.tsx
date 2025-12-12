import type { Recipe } from "../../types/recipes";

type Props = {
  recipe: Recipe;
  onDelete: (id: string) => void;
};

export default function RecipeCard({ recipe, onDelete }: Props) {
  return (
    <div>
      <img src={recipe.img} alt={recipe.title}/>

      <h2>{recipe.title}</h2>

      {recipe.categories && (
        <div>
          <p>Technique : {recipe.categories.tech_cuisson}</p>
          <p>Régime : {recipe.categories.regime}</p>
          <p>Temps : {recipe.categories.temps}</p>
          <p>Difficulté : {recipe.categories.difficulty}</p>
        </div>
      )}

      <div>
        <a href={`/recipes/${recipe.recette_id}`}>Voir</a>

        <a href={`/recipes/update/${recipe.recette_id}`}>Modifier</a>

        <button onClick={() => onDelete(recipe.recette_id)}>Supprimer</button>
      </div>
    </div>
  );
}
