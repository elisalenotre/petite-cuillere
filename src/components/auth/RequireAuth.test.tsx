import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, type Mock } from 'vitest';
import { RequireAuth } from './RequireAuth';
import { useAuth } from '../../contexts/AuthContext';

// On mocke le hook useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mocker Navigate de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div>REDIRECT_TO:{to}</div>
    ),
  };
});

const mockedUseAuth = useAuth as unknown as Mock;

beforeEach(() => {
  mockedUseAuth.mockReset();
});

describe('RequireAuth', () => {
  it("affiche un message de chargement quand 'loading' est true", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <RequireAuth>
          <div>Contenu privé</div>
        </RequireAuth>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/vérification de la connexion/i)
    ).toBeInTheDocument();
  });

  it("redirige vers /auth quand aucun utilisateur n'est connecté", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <RequireAuth>
          <div>Contenu privé</div>
        </RequireAuth>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/redirect_to:\/auth/i)
    ).toBeInTheDocument();
  });

  it('rend les enfants quand un utilisateur est connecté', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: '123' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <RequireAuth>
          <div>Contenu privé</div>
        </RequireAuth>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/contenu privé/i)
    ).toBeInTheDocument();
  });
});
