import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipesPage from "./RecipesPage";

// --------------------
// Mocks des composants enfants (on teste la page, pas les enfants)
// --------------------
vi.mock("../../components/recipes/SearchBar/SearchBar", () => ({
  default: ({ search, setSearch }: any) => (
    <input
      aria-label="searchbar"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  ),
}));

vi.mock("../../components/recipes/Filters/Filters", () => ({
  default: () => <div data-testid="filters" />,
}));

// RecipesList affiche juste les titres + un bouton delete qui appelle onDelete(id)
vi.mock("../../components/recipes/RecipeList/RecipesList", () => ({
  default: ({ recipes, onDelete }: any) => (
    <div>
      {recipes.map((r: any) => (
        <div key={r.recettes_id}>
          <span>{r.title}</span>
          <button onClick={() => onDelete(r.recettes_id)}>delete-{r.recettes_id}</button>
        </div>
      ))}
    </div>
  ),
}));

// Pagination: un bouton qui force setPage(2)
vi.mock("../../components/recipes/Pagination/Pagination", () => ({
  default: ({ page, setPage }: any) => (
    <div>
      <span>page:{page}</span>
      <button onClick={() => setPage(2)}>go-page-2</button>
    </div>
  ),
}));

// RecipeForm: un simple marqueur
vi.mock("../../components/recipes/RecipeForm/RecipeForm", () => ({
  default: ({ onClose }: any) => (
    <div>
      <p>RecipeForm</p>
      <button onClick={onClose}>close-modal</button>
    </div>
  ),
}));

// --------------------
// Mock deleteRecipe
// --------------------
const deleteRecipeMock = vi.fn();
vi.mock("../../services/recipesService", () => ({
  deleteRecipe: (...args: any[]) => deleteRecipeMock(...args),
}));

// --------------------
// Mock Supabase chain: from().select().range()
// --------------------
const rangeMock = vi.fn();
const selectMock = vi.fn(() => ({ range: rangeMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));

vi.mock("../../supabase", () => ({
  supabase: {
    from: (...args: Parameters<typeof fromMock>) => fromMock(...args),
  },
}));

const recipesPage1 = [
  {
    recettes_id: "1",
    title: "Ramen",
    created_at: "2024-01-01",
    categories: { regime: "Vegan", temps: "Rapide", tech_cuisson: "Poêle", difficulty: "Facile" },
  },
  {
    recettes_id: "2",
    title: "Pesto",
    created_at: "2024-01-02",
    categories: { regime: "Végétarien", temps: "Rapide", tech_cuisson: "Poêle", difficulty: "Facile" },
  },
];

const recipesPage2 = [
  {
    recettes_id: "3",
    title: "Curry",
    created_at: "2024-01-03",
    categories: { regime: "Vegan", temps: "Plus d'1h", tech_cuisson: "Vapeur", difficulty: "Difficile" },
  },
];

describe("RecipesPage", () => {
  beforeEach(() => {
    // IMPORTANT: reset les once (sinon décalage entre tests)
    rangeMock.mockReset();
    deleteRecipeMock.mockReset();

    // optionnel mais clean
    fromMock.mockClear();
    selectMock.mockClear();

    rangeMock
        .mockResolvedValueOnce({ data: recipesPage1, error: null, count: 12 })
        .mockResolvedValueOnce({ data: recipesPage2, error: null, count: 12 });

    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => {});
        });


  it("charge et affiche les recettes (loadRecipes)", async () => {
    render(<RecipesPage />);

    // On attend que les recettes apparaissent
    expect(await screen.findByText("Ramen")).toBeInTheDocument();
    expect(screen.getByText("Pesto")).toBeInTheDocument();

    // Vérifie que supabase a bien été appelé sur la table recettes
    expect(fromMock).toHaveBeenCalledWith("recettes");
    expect(selectMock).toHaveBeenCalledWith("*, categories(*)", { count: "exact" });

    // page=1 pageSize=6 => from=0 to=5
    expect(rangeMock).toHaveBeenCalledWith(0, 5);
  });

  it("ouvre la modal au clic sur 'Créer une recette'", async () => {
    render(<RecipesPage />);

    // attendre le rendu initial
    await screen.findByText("Ramen");

    fireEvent.click(screen.getByRole("button", { name: /créer une recette/i }));

    expect(screen.getByText("RecipeForm")).toBeInTheDocument();

    // fermeture
    fireEvent.click(screen.getByRole("button", { name: /close-modal/i }));
    await waitFor(() => {
      expect(screen.queryByText("RecipeForm")).not.toBeInTheDocument();
    });
  });

  it("supprime une recette via RecipesList -> confirm -> deleteRecipe -> UI update", async () => {
    deleteRecipeMock.mockResolvedValueOnce(undefined);

    render(<RecipesPage />);

    expect(await screen.findByText("Ramen")).toBeInTheDocument();
    expect(screen.getByText("Pesto")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "delete-1" }));

    expect(window.confirm).toHaveBeenCalledWith("Supprimer cette recette ?");

    await waitFor(() => {
      expect(deleteRecipeMock).toHaveBeenCalledWith("1");
    });

    // la recette 1 disparaît
    await waitFor(() => {
      expect(screen.queryByText("Ramen")).not.toBeInTheDocument();
      expect(screen.getByText("Pesto")).toBeInTheDocument();
    });
  });

  it("change de page via Pagination et recharge les recettes (range page 2)", async () => {
    render(<RecipesPage />);

    expect(await screen.findByText("Ramen")).toBeInTheDocument();

    // clique pour passer page 2
    fireEvent.click(screen.getByRole("button", { name: /go-page-2/i }));

    // page 2 doit afficher Curry
    expect(await screen.findByText("Curry")).toBeInTheDocument();

    // page=2 => from=6 to=11
    expect(rangeMock).toHaveBeenLastCalledWith(6, 11);
  });

  it("ne supprime pas si confirm = false", async () => {
    (window.confirm as any).mockReturnValueOnce(false);

    render(<RecipesPage />);

    expect(await screen.findByText("Ramen")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "delete-1" }));

    expect(deleteRecipeMock).not.toHaveBeenCalled();
    // toujours présent
    expect(screen.getByText("Ramen")).toBeInTheDocument();
  });
});
