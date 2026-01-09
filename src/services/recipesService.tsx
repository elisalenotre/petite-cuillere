import { supabase } from '../supabase';
import type { Recipe } from '../types/recipes';


/* =============================
   GET ALL RECIPES (Pagination)
============================= */
export async function getRecipes(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("recipes")
    .select("*, categorie(*)", { count: "exact" }) 
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    recipes: data ?? [],
    total: count ?? 0,
  };
}

/* =============================
   GET RECIPE BY ID
============================= */
export async function getRecipeById(id: string) {
  const { data, error } = await supabase
    .from("recettes") // table correcte
    .select("*, categories(*)")
    .eq("recettes_id", id) // colonne correcte
    .single();
  if (error) throw new Error(error.message);
  return data as Recipe;
}

/* =============================
   CREATE RECIPE
============================= */
export async function createRecipe(form: any) {
  const { imgFile, ...fields } = form;

  let imgUrl = null;

  // Upload image si file présent
  if (imgFile) {
    const fileName = `${Date.now()}_${imgFile.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("recipes")
      .upload(fileName, imgFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: urlData } = supabase.storage
      .from("recipes")
      .getPublicUrl(uploadData.path);

    imgUrl = urlData.publicUrl;
  }

  // Insert en base
  const { error } = await supabase.from("recipes").insert({
    ...fields,
    img: imgUrl,
  });

  if (error) throw new Error(error.message);
}

/* =============================
   UPDATE RECIPE
============================= */
export async function updateRecipe(id: string, form: any) {
  const { imgFile, ...fields } = form;

  let imgUrl = fields.img; // garde l’ancienne image si pas remplacée

  // Si nouvelle image → upload
  if (imgFile) {
    const fileName = `${Date.now()}_${imgFile.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("recipes")
      .upload(fileName, imgFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: urlData } = supabase.storage
      .from("recipes")
      .getPublicUrl(uploadData.path);

    imgUrl = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("recipes")
    .update({ ...fields, img: imgUrl })
    .eq("recette_id", id);

  if (error) throw new Error(error.message);
}

/* =============================
   DELETE RECIPE
============================= */
export async function deleteRecipe(recettes_id: string): Promise<void> {
  const { error } = await supabase
    .from("recettes")
    .delete()
    .eq("recettes_id", recettes_id);

  if (error) {
    throw error;
  }
}
