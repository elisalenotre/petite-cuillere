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
  recettes_id: number;
  title: string;
  img?: string;
  description?: string;
  categories?: {
    regime: string;
    temps: string;
    tech_cuisson: string;
    difficulty: string;
  };
};
