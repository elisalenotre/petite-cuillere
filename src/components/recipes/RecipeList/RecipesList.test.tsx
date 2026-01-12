import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Recipe } from "../../../types/recipes";
import RecipesList from "./RecipesList";

const RecipeCardMock = vi.fn(
  ({ recipe }: {
      [x: string]: any; recipe: Recipe 
}) => (
    <div data-testid="recipe-card">{recipe.title}</div>
  )
);

vi.mock("../RecipeCard/RecipeCard", () => ({
  default: (props: any) => RecipeCardMock(props),
}));

function makeRecipe(partial: Partial<Recipe>): Recipe {
  return {
    recettes_id: "id",
    user_id: "u1",
    cat_id: null,
    title: "Titre",
    img: null,
    description: null,
    created_at: new Date().toISOString(),
    categories: null,
    ...partial,
  };
}

describe("RecipesList", () => {
  beforeEach(() => {
    RecipeCardMock.mockClear();
  });

  it("rend une RecipeCard par recette", () => {
    const recipes = [
      makeRecipe({ recettes_id: "r1", title: "Recette 1" }),
      makeRecipe({ recettes_id: "r2", title: "Recette 2" }),
      makeRecipe({ recettes_id: "r3", title: "Recette 3" }),
    ];

    const onDelete = vi.fn();

    render(<RecipesList recipes={recipes} onDelete={onDelete} />);

    expect(screen.getAllByTestId("recipe-card")).toHaveLength(3);
    expect(screen.getByText("Recette 1")).toBeInTheDocument();
    expect(screen.getByText("Recette 2")).toBeInTheDocument();
    expect(screen.getByText("Recette 3")).toBeInTheDocument();
  });

  it("passe la bonne recette et la fonction onDelete à RecipeCard", () => {
    const recipes = [
      makeRecipe({ recettes_id: "r1", title: "Recette 1" }),
      makeRecipe({ recettes_id: "r2", title: "Recette 2" }),
    ];

    const onDelete = vi.fn();

    render(<RecipesList recipes={recipes} onDelete={onDelete} />);

    expect(RecipeCardMock).toHaveBeenCalledTimes(2);

    expect(RecipeCardMock.mock.calls[0][0].recipe.recettes_id).toBe("r1");
    expect(RecipeCardMock.mock.calls[0][0].onDelete).toBe(onDelete);

    expect(RecipeCardMock.mock.calls[1][0].recipe.recettes_id).toBe("r2");
    expect(RecipeCardMock.mock.calls[1][0].onDelete).toBe(onDelete);
  });

  it("ne rend rien si recipes est vide", () => {
    render(<RecipesList recipes={[]} onDelete={vi.fn()} />);
    expect(screen.queryByTestId("recipe-card")).not.toBeInTheDocument();
  });
});
