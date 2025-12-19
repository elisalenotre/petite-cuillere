// Représente une catégorie (liaison avec recette)
export type Category = {
  cat_id: string;
  tech_cuisson: string;
  regime: string;
  temps: string;
  difficulty: string;
};

// Représente une recette
export type Recipe = {
  categorie: any;
  recette_id: string;
  user_id: string;
  cat_id: string;
  img: string;
  title: string;
  description: string;
  created_at: string;

  // optionnel : si on fait un join dans Supabase
  categories?: Category;
};
