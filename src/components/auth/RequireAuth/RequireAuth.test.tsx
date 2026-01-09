import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequireAuth } from './RequireAuth';
import { useLocation } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(() => ({ pathname: '/private' })),
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
  };
});

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('RequireAuth', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le message de chargement si loading est true', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(
      <RequireAuth>
        <div>Contenu protégé</div>
      </RequireAuth>
    );
    expect(screen.getByText(/Vérification de la connexion/i)).toBeInTheDocument();
  });

  it('redirige vers /auth si user est null et loading est false', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(
      <RequireAuth>
        <div>Contenu protégé</div>
      </RequireAuth>
    );
    expect(screen.getByText(/Navigate to \/auth/i)).toBeInTheDocument();
  });

  it('affiche les enfants si user est défini et loading est false', () => {
    mockUseAuth.mockReturnValue({ user: { id: 1, name: 'Elisa' }, loading: false });
    render(
      <RequireAuth>
        <div>Contenu protégé</div>
      </RequireAuth>
    );
    expect(screen.getByText(/Contenu protégé/i)).toBeInTheDocument();
  });

  it('passe bien la location courante dans le state de Navigate', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/test-location' });
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(
      <RequireAuth>
        <div>Contenu protégé</div>
      </RequireAuth>
    );
    expect(screen.getByText(/Navigate to \/auth/i)).toBeInTheDocument();
  });
});