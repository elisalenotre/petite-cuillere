import { useState, useEffect } from "react";
import { createRecipe, updateRecipe } from "../../../services/recipesService";
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
      if (isEditing && existingRecipe) {
        const updated = await updateRecipe(existingRecipe.recettes_id, {
          title,
          description: description || null,
          imgUrl: img || null,
          regime,
          temps,
          tech_cuisson: techCuisson,
          difficulty,
        });
        onRecipeAdded(updated as Recipe);
        onClose();
      } else {
        const created = await createRecipe({
          title,
          description: description || null,
          imgUrl: img || null,
          regime,
          temps,
          tech_cuisson: techCuisson,
          difficulty,
        });
        onRecipeAdded(created as Recipe);
        resetForm();
        onClose();
      }
    } catch (err: any) {
      setFormError(err?.message || "Une erreur inattendue s'est produite.");
      setSubmitting(false);
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