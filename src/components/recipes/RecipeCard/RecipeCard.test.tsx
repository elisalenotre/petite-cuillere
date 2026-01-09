import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RecipeCard from "./RecipeCard";

// Si ton type Recipe a d'autres champs obligatoires, complète ici.
// L'idée : mettre juste ce qu'il faut pour le composant.
const baseRecipe = {
  recettes_id: "abc-123",
  title: "Pâtes pesto",
  img: "https://example.com/pates.jpg",
  user_id: "owner-1",
  categories: {
    tech_cuisson: "Poêle",
    regime: "Vegan",
    temps: "Rapide",
    difficulty: "Facile",
  },
} as any;

function setup(recipe = baseRecipe, currentUserId: string | null = "owner-1") {
  const onDelete = vi.fn();

  render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} onDelete={onDelete} currentUserId={currentUserId} />
    </MemoryRouter>
  );

  return { onDelete };
}

describe("RecipeCard", () => {
  it("affiche le titre et l'image", () => {
    setup();

    expect(screen.getByRole("heading", { name: "Pâtes pesto" })).toBeInTheDocument();

    const img = screen.getByRole("img", { name: "Pâtes pesto" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/pates.jpg");
  });

  it("affiche les catégories quand elles existent", () => {
    setup();

    expect(screen.getByText("Poêle")).toBeInTheDocument();
    expect(screen.getByText("Vegan")).toBeInTheDocument();
    expect(screen.getByText("Rapide")).toBeInTheDocument();
    expect(screen.getByText("Facile")).toBeInTheDocument();
  });

  it("ne rend pas le bloc catégories si categories est null/undefined", () => {
    const recipeNoCat = { ...baseRecipe, categories: null } as any;
    setup(recipeNoCat);

    // On vérifie l'absence de textes catégories
    expect(screen.queryByText("Poêle")).not.toBeInTheDocument();
    expect(screen.queryByText("Vegan")).not.toBeInTheDocument();
    expect(screen.queryByText("Rapide")).not.toBeInTheDocument();
    expect(screen.queryByText("Facile")).not.toBeInTheDocument();
  });

  it("a des liens corrects vers le détail et la page update (pour le propriétaire)", () => {
    setup(baseRecipe, "owner-1");

    const voirLink = screen.getByRole("link", { name: "Voir" });
    expect(voirLink).toHaveAttribute("href", "/recipes/abc-123");

    const modifLink = screen.getByRole("link", { name: "Modifier" });
    expect(modifLink).toHaveAttribute("href", "/recipes/update/abc-123");
  });

  it("appelle onDelete avec l'id quand on clique sur Supprimer (pour le propriétaire)", async () => {
    const { onDelete } = setup(baseRecipe, "owner-1");

    const user = userEvent.setup();
    const deleteBtn = screen.getByRole("button", { name: "Supprimer" });

    await user.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("abc-123");
  });

  it("gère img vide (src absent ou vide) sans crasher", () => {
    const recipeNoImg = { ...baseRecipe, img: "" } as any;
    setup(recipeNoImg);

    // Avec placeholder accessible
    const placeholder = screen.getByLabelText(/image indisponible/i);
    expect(placeholder).toBeInTheDocument();
  });
});
