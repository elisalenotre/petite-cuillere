import { useState } from "react";
import { supabase } from "../../supabase";
import type { Recipe } from "../../types/recipes";

type Props = {
  onClose: () => void;
  onRecipeAdded: (recipe: Recipe) => void;
};

export default function RecipeForm({ onClose, onRecipeAdded }: Props) {
  const [title, setTitle] = useState("");
  const [img, setImageUrl] = useState("");
  const [description, setInstructions] = useState("");

  const [regime, setRegime] = useState("");
  const [temps, setTemps] = useState("");
  const [techCuisson, setTechCuisson] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !regime || !temps || !techCuisson || !difficulty) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // --- Récupérer l'utilisateur connecté
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Vous devez être connecté pour ajouter une recette");
      console.error(userError);
      return;
    }

    // --- Vérifier si la catégorie existe déjà
    let catId: number | null = null;
    const { data: existingCat } = await supabase
      .from("categories")
      .select("*")
      .eq("regime", regime)
      .eq("temps", temps)
      .eq("tech_cuisson", techCuisson)
      .eq("difficulty", difficulty)
      .single();

    if (existingCat) {
      catId = existingCat.id;
    } else {
      // Créer une nouvelle catégorie si elle n'existe pas
      const { data: newCat, error: catError } = await supabase
        .from("categories")
        .insert([{ regime, temps, tech_cuisson: techCuisson, difficulty }])
        .select()
        .single();

      if (catError) {
        alert("Erreur lors de la création de la catégorie");
        console.error(catError);
        return;
      }

      catId = newCat.id;
    }

    // --- Ajouter la recette avec user_id
    const { data, error } = await supabase
      .from("recettes")
      .insert([
        {
          title,
          img,
          description,
          cat_id: catId,
          user_id: user.id, // ← IMPORTANT
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Erreur lors de l'ajout de la recette");
      console.error(error);
    } else if (data) {
      onRecipeAdded(data as Recipe);
      onClose();
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre de la recette"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="URL de l'image"
        value={img}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <textarea
        placeholder="Déroulé de la recette"
        value={description}
        onChange={(e) => setInstructions(e.target.value)}
        rows={4}
      />

      <select value={regime} onChange={(e) => setRegime(e.target.value)} required>
        <option value="">Régime</option>
        <option value="Végétarien">Végétarien</option>
        <option value="Vegan">Vegan</option>
        <option value="Sans gluten">Sans gluten</option>
      </select>

      <select value={temps} onChange={(e) => setTemps(e.target.value)} required>
        <option value="">Temps de cuisson</option>
        <option value="Rapide">Rapide</option>
        <option value="Moins de 30 min">Moins de 30 min</option>
        <option value="Plus d'1h">Plus d'1h</option>
      </select>

      <select value={techCuisson} onChange={(e) => setTechCuisson(e.target.value)} required>
        <option value="">Technique de cuisson</option>
        <option value="Four">Four</option>
        <option value="Poêle">Poêle</option>
        <option value="Vapeur">Vapeur</option>
        <option value="Sans cuisson">Sans cuisson</option>
      </select>

      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
        <option value="">Difficulté</option>
        <option value="Facile">Facile</option>
        <option value="Intermédiaire">Intermédiaire</option>
        <option value="Difficile">Difficile</option>
      </select>

      <div className="recipe-form-buttons">
        <button type="submit">Ajouter</button>
        <button type="button" onClick={onClose} style={{ backgroundColor: "#e74c3c" }}>
          Annuler
        </button>
      </div>
    </form>
  );
}
