import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import type { Recipe } from "../../../types/recipes";

type Props = {
  onClose: () => void;
  onRecipeAdded: (recipe: Recipe) => void;
  existingRecipe?: Recipe; 
};

export default function RecipeForm({ onClose, onRecipeAdded, existingRecipe }: Props) {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");

  const [regime, setRegime] = useState("");
  const [temps, setTemps] = useState("");
  const [techCuisson, setTechCuisson] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = !!existingRecipe; 

  // Pré-remplir le formulaire si mode édition
  useEffect(() => {
    if (existingRecipe) {
      setTitle(existingRecipe.title || "");
      setImg(existingRecipe.img || "");
      setDescription(existingRecipe.description || "");
      
      if (existingRecipe.categories) {
        setRegime(existingRecipe.categories.regime || "");
        setTemps(existingRecipe.categories.temps || "");
        setTechCuisson(existingRecipe.categories.tech_cuisson || "");
        setDifficulty(existingRecipe.categories.difficulty || "");
      }
    }
  }, [existingRecipe]);

  const resetForm = () => {
    setTitle("");
    setImg("");
    setDescription("");
    setRegime("");
    setTemps("");
    setTechCuisson("");
    setDifficulty("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !regime || !temps || !techCuisson || !difficulty) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setFormError("Vous devez être connecté.");
        return;
      }

      // Recherche ou création de catégorie
      const { data: existingCat, error: existingCatError } = await supabase
        .from("categories")
        .select("cat_id")
        .eq("regime", regime)
        .eq("temps", temps)
        .eq("tech_cuisson", techCuisson)
        .eq("difficulty", difficulty)
        .maybeSingle();

      if (existingCatError) {
        console.error(existingCatError);
        setFormError("Erreur lors de la recherche de la catégorie.");
        return;
      }

      let catId: string;

      if (existingCat?.cat_id) {
        catId = existingCat.cat_id;
      } else {
        const { data: newCat, error: catError } = await supabase
          .from("categories")
          .insert([
            {
              regime,
              temps,
              tech_cuisson: techCuisson,
              difficulty,
            },
          ])
          .select("cat_id")
          .single();

        if (catError) {
          console.error(catError);
          setFormError("Erreur lors de la création de la catégorie.");
          return;
        }

        catId = newCat.cat_id;
      }

    // Mode édition : UPDATE
    if (isEditing && existingRecipe) {
      console.log("🔄 Début de la modification...");
      
      // faire l'update sans select
      const { error: updateError } = await supabase
        .from("recettes")
        .update({
          title,
          img: img || null,
          description: description || null,
          cat_id: catId,
        })
        .eq("recettes_id", existingRecipe.recettes_id);

      console.log("📝 Résultat update:", updateError ? "ERREUR" : "OK");

      if (updateError) {
        console.error("❌ Erreur update:", updateError);
        setFormError("Erreur lors de la modification de la recette.");
        return;
    }

  // récupérer la recette mise à jour avec les catégories
      const { data: recipe, error: fetchError } = await supabase
        .from("recettes")
        .select("*, categories(*)")
        .eq("recettes_id", existingRecipe.recettes_id)
        .single();

        console.log("📦 Recette récupérée:", recipe);

        if (fetchError || !recipe) {
          console.error("❌ Erreur fetch:", fetchError);
          setFormError("Erreur lors de la récupération de la recette.");
          return;
        }

        console.log("✅ Recette mise à jour avec succès!");
        onRecipeAdded(recipe as Recipe);
        onClose();
      }
      // Mode création : INSERT
      else {
        const { data: recipe, error: recipeError } = await supabase
          .from("recettes")
          .insert([
            {
              title,
              img: img || null,
              description: description || null,
              cat_id: catId,
              user_id: user.id,
            },
          ])
          .select("*, categories(*)")
          .single();

        if (recipeError) {
          console.error(recipeError);
          setFormError("Erreur lors de l'ajout de la recette.");
          return;
        }

        onRecipeAdded(recipe as Recipe);
        resetForm();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="recipes-title">
        <h2>{isEditing ? "Modifier la recette" : "Ajouter une recette"}</h2>
      </div>

      <label>
        Titre *
        <input
          type="text"
          placeholder="Titre de la recette"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Image (URL)
        <input
          type="text"
          placeholder="https://..."
          value={img}
          onChange={(e) => setImg(e.target.value)}
        />
      </label>

      <label>
        Déroulé
        <textarea
          placeholder="Déroulé de la recette"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </label>

      <div className="recipe-form-grid">
        <label>
          Régime *
          <select value={regime} onChange={(e) => setRegime(e.target.value)} required>
            <option value="">Choisir</option>
            <option value="Végétarien">Végétarien</option>
            <option value="Vegan">Vegan</option>
            <option value="Sans gluten">Sans gluten</option>
          </select>
        </label>

        <label>
          Temps *
          <select value={temps} onChange={(e) => setTemps(e.target.value)} required>
            <option value="">Choisir</option>
            <option value="Rapide">Rapide</option>
            <option value="Moins de 30 min">Moins de 30 min</option>
            <option value="Plus d'1h">Plus d'1h</option>
          </select>
        </label>

        <label>
          Technique *
          <select value={techCuisson} onChange={(e) => setTechCuisson(e.target.value)} required>
            <option value="">Choisir</option>
            <option value="Four">Four</option>
            <option value="Poêle">Poêle</option>
            <option value="Vapeur">Vapeur</option>
            <option value="Sans cuisson">Sans cuisson</option>
          </select>
        </label>

        <label>
          Difficulté *
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
            <option value="">Choisir</option>
            <option value="Facile">Facile</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Difficile">Difficile</option>
          </select>
        </label>
      </div>

      {formError && <p className="form-error">{formError}</p>}

      <div className="recipe-form-buttons">
        <button type="submit" disabled={submitting}>
          {submitting ? "En cours..." : (isEditing ? "Modifier" : "Ajouter")}
        </button>
        <button type="button" onClick={onClose} disabled={submitting}>
          Annuler
        </button>
      </div>
    </form>
  );
}