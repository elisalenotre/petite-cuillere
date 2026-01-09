import { supabase } from '../supabase';
import type { Recipe } from '../types/recipes';

type CategoryInput = {
  regime: string;
  temps: string;
  tech_cuisson: string;
  difficulty: string;
};

async function getOrCreateCategory(input: CategoryInput): Promise<string> {
  const { regime, temps, tech_cuisson, difficulty } = input;

  const { data: existingCat, error: existingCatError } = await supabase
    .from("categories")
    .select("cat_id")
    .eq("regime", regime)
    .eq("temps", temps)
    .eq("tech_cuisson", tech_cuisson)
    .eq("difficulty", difficulty)
    .maybeSingle();

  if (existingCatError) {
    throw new Error("Erreur lors de la recherche de la catégorie.");
  }

  if (existingCat?.cat_id) {
    return existingCat.cat_id;
  }

  const { data: newCat, error: catError } = await supabase
    .from("categories")
    .insert([
      { regime, temps, tech_cuisson, difficulty },
    ])
    .select("cat_id")
    .single();

  if (catError) {
    throw new Error("Erreur lors de la création de la catégorie.");
  }

  return newCat.cat_id as string;
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

/* =============================
   GET RECIPE BY ID
============================= */
export async function getRecipeById(recettes_id: string): Promise<Recipe> {
  const { data, error } = await supabase
    .from("recettes")
    .select("*, categories(*)")
    .eq("recettes_id", recettes_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Recipe;
}

/* =============================
   CREATE RECIPE
============================= */
export type CreateRecipeInput = {
  title: string;
  description?: string | null;
  imgUrl?: string | null;
} & CategoryInput;

export async function createRecipe(input: CreateRecipeInput): Promise<Recipe> {
  const { title, description = null, imgUrl, regime, temps, tech_cuisson, difficulty } = input;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Vous devez être connecté.");
  }

  const cat_id = await getOrCreateCategory({ regime, temps, tech_cuisson, difficulty });

  const finalImg: string | null = imgUrl ?? null;

  const { data: newRecipe, error: insertError } = await supabase
    .from("recettes")
    .insert([
      {
        title,
        img: finalImg,
        description,
        cat_id,
        user_id: userData.user.id,
      },
    ])
    .select("*, categories(*)")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return newRecipe as Recipe;
}

/* =============================
   UPDATE RECIPE
============================= */
export type UpdateRecipeInput = {
  title?: string;
  description?: string | null;
  imgUrl?: string | null;
  regime?: string;
  temps?: string;
  tech_cuisson?: string;
  difficulty?: string;
};

export async function updateRecipe(recettes_id: string, input: UpdateRecipeInput): Promise<Recipe> {
  // Récupérer l'existant pour conserver l'image si nécessaire
  const existing = await getRecipeById(recettes_id);

  // Catégorie: si fournie, recalculer; sinon garder cat_id existant
  let cat_id = existing.cat_id;
  const hasCatChanges = input.regime || input.temps || input.tech_cuisson || input.difficulty;
  if (hasCatChanges) {
    cat_id = await getOrCreateCategory({
      regime: input.regime ?? existing.categories?.regime ?? "",
      temps: input.temps ?? existing.categories?.temps ?? "",
      tech_cuisson: input.tech_cuisson ?? existing.categories?.tech_cuisson ?? "",
      difficulty: input.difficulty ?? existing.categories?.difficulty ?? "",
    });
  }

  // Image: priorité au fichier, sinon imgUrl, sinon garder l'existant
  let finalImg: string | null = existing.img ?? null;
  if (typeof input.imgUrl !== "undefined") {
    finalImg = input.imgUrl;
  }

  const { data: updated, error: updateError } = await supabase
    .from("recettes")
    .update({
      title: typeof input.title !== "undefined" ? input.title : existing.title,
      description: typeof input.description !== "undefined" ? input.description : existing.description,
      img: finalImg,
      cat_id,
    })
    .eq("recettes_id", recettes_id)
    .select("*, categories(*)")
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return updated as Recipe;
}

/* =============================
   LIST RECIPES (filters/sort/pagination)
============================= */
export type ListFilters = {
  regime?: string;
  temps?: string;
  tech_cuisson?: string;
  difficulty?: string;
};

export type ListParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: ListFilters;
  sort?: "alpha-asc" | "alpha-desc" | "date-asc" | "date-desc";
};

export async function getRecipesWithClient(client: any, params: ListParams): Promise<{ recipes: Recipe[]; total: number }> {
  const { page, pageSize, search = "", filters = {}, sort = "date-desc" } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const hasCategoryFilter = !!filters.regime || !!filters.temps || !!filters.tech_cuisson || !!filters.difficulty;
  const selectClause = hasCategoryFilter ? "*, categories!inner(*)" : "*, categories(*)";

  let query: any = client
    .from("recettes")
    .select(selectClause, { count: "exact" });

  if (search.trim() && typeof query.ilike === "function") {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  if (filters.regime && typeof query.eq === "function") {
    query = query.eq("categories.regime", filters.regime);
  }
  if (filters.temps && typeof query.eq === "function") {
    query = query.eq("categories.temps", filters.temps);
  }
  if (filters.tech_cuisson && typeof query.eq === "function") {
    query = query.eq("categories.tech_cuisson", filters.tech_cuisson);
  }
  if (filters.difficulty && typeof query.eq === "function") {
    query = query.eq("categories.difficulty", filters.difficulty);
  }

  let needsLocalSort = false;
  if (typeof query.order === "function") {
    switch (sort) {
      case "alpha-asc":
        query = query.order("title", { ascending: true, nullsFirst: false });
        break;
      case "alpha-desc":
        query = query.order("title", { ascending: false, nullsFirst: false });
        break;
      case "date-asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "date-desc":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }
  } else {
    needsLocalSort = true;
  }

  const { data, error, count } = await query.range(from, to);
  if (error) {
    throw new Error("Erreur lors du chargement des recettes.");
  }

  let rows = (data ?? []) as Recipe[];
  if (needsLocalSort && rows.length) {
    rows = [...rows].sort((a: any, b: any) => {
      switch (sort) {
        case "alpha-asc":
          return (a.title ?? "").localeCompare(b.title ?? "");
        case "alpha-desc":
          return (b.title ?? "").localeCompare(a.title ?? "");
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date-desc":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }

  return { recipes: rows, total: count ?? 0 };
}

export async function getRecipes(params: ListParams): Promise<{ recipes: Recipe[]; total: number }> {
  return getRecipesWithClient(supabase as any, params);
}
