import type { Category } from "./categories";

export type Recipe = {
  recette_id: any;
  recettes_id: string;
  user_id: string;
  cat_id: string | null;

  title: string;
  img?: string | null;
  description?: string | null;
  created_at: string;

  categories?: Category | null;
};
