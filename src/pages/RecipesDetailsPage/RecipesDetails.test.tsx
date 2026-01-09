import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import RecipesDetails from './RecipesDetails';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock useNavigate pour observer la redirection
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  const navigateSpy = vi.fn();
  (globalThis as any).__navigateMock = navigateSpy;
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

const getNavigateMock = () => (globalThis as any).__navigateMock as ReturnType<typeof vi.fn>;

// Variables de contrôle pour le mock Supabase
let currentUser: { id: string } | null = null;
let singleResult: { data: any; error: any } = { data: null, error: null };
let deleteResult: { error: any } = { error: null };

// Mock de supabase avec chaînes d'appels utilisées par la page
vi.mock('../../supabase', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: currentUser } })),
      },
      from: vi.fn((_table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn((_col: string, _val: string) => ({
            single: vi.fn(async () => singleResult),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(async (_col: string, _val: string) => deleteResult),
        })),
      })),
    },
  };
});

// Stub de RecipeForm pour simplifier l'affichage du modal
vi.mock('../../components/recipes/RecipeForm/RecipeForm', () => {
  return {
    default: function RecipeFormStub() {
      return <div data-testid="recipe-form-stub">RecipeForm</div>;
    },
  };
});

function renderWithRoute(path = '/recipes/42') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipesDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RecipesDetailsPage', () => {
  beforeEach(() => {
    currentUser = null;
    singleResult = { data: null, error: null };
    deleteResult = { error: null };
    // reset navigate spy calls
    getNavigateMock()?.mockReset?.();
  });

  it('affiche le chargement puis la recette une fois chargée', async () => {
    const recipe = {
      recettes_id: '42',
      title: 'Ratatouille Maison',
      description: 'Coupez, cuire, mijoter.',
      img: 'https://example.com/image.jpg',
      user_id: 'user-1',
      categories: {
        tech_cuisson: 'Four',
        regime: 'Végé',
        temps: '30 min',
        difficulty: 'Facile',
      },
    };
    singleResult = { data: recipe, error: null };

    renderWithRoute();

    // état de chargement visible au départ
    expect(
      screen.getByText(/chargement\.+ nous cuisinons votre recette\.+/i)
    ).toBeInTheDocument();

    // puis affiche le titre de la recette
    expect(await screen.findByText(/ratatouille maison/i)).toBeInTheDocument();
  });

  it('affiche "Recette introuvable" si la requête retourne une erreur', async () => {
    singleResult = { data: null, error: { message: 'Not found' } };

    renderWithRoute();

    expect(await screen.findByText(/recette introuvable/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /retour aux recettes/i })).toBeInTheDocument();
  });

  it("affiche les actions propriétaire quand l'utilisateur est le propriétaire", async () => {
    currentUser = { id: 'owner-1' };
    singleResult = {
      data: {
        recettes_id: '42',
        title: 'Soupe à l’oignon',
        user_id: 'owner-1',
        categories: {},
      },
      error: null,
    };

    renderWithRoute();

    expect(await screen.findByText(/soupe à l’oignon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument();
  });

  it("n'affiche pas les actions propriétaire pour un non-propriétaire", async () => {
    currentUser = { id: 'user-x' };
    singleResult = {
      data: {
        recettes_id: '42',
        title: 'Crème brûlée',
        user_id: 'owner-2',
        categories: {},
      },
      error: null,
    };

    renderWithRoute();

    expect(await screen.findByText(/crème brûlée/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /modifier/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /supprimer/i })).not.toBeInTheDocument();
  });

  it('ouvre le modal de modification quand on clique sur Modifier (propriétaire)', async () => {
    currentUser = { id: 'owner-1' };
    singleResult = {
      data: {
        recettes_id: '42',
        title: 'Tarte Tatin',
        user_id: 'owner-1',
        categories: {},
      },
      error: null,
    };

    const user = userEvent.setup();
    renderWithRoute();
    const editBtn = await screen.findByRole('button', { name: /modifier/i });
    await user.click(editBtn);

    expect(screen.getByTestId('recipe-form-stub')).toBeInTheDocument();
  });

  it('supprime la recette et redirige vers /recipes quand confirmé (propriétaire)', async () => {
    currentUser = { id: 'owner-1' };
    singleResult = {
      data: {
        recettes_id: '42',
        title: 'Clafoutis',
        user_id: 'owner-1',
        categories: {},
      },
      error: null,
    };
    deleteResult = { error: null };

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    renderWithRoute();
    const deleteBtn = await screen.findByRole('button', { name: /supprimer/i });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(getNavigateMock()).toHaveBeenCalled();
    });
    expect(getNavigateMock()).toHaveBeenCalledWith('/recipes');
    confirmSpy.mockRestore();
  });

  it('affiche une erreur si la suppression échoue', async () => {
    currentUser = { id: 'owner-1' };
    singleResult = {
      data: {
        recettes_id: '42',
        title: 'Mousse au chocolat',
        user_id: 'owner-1',
        categories: {},
      },
      error: null,
    };
    deleteResult = { error: { message: 'Oops' } };

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();

    renderWithRoute();
    const deleteBtn = await screen.findByRole('button', { name: /supprimer/i });
    await user.click(deleteBtn);

    expect(alertSpy).toHaveBeenCalled();
    expect(
      await screen.findByText(/erreur lors de la suppression de la recette/i)
    ).toBeInTheDocument();

    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
