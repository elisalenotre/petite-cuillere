import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { AuthPage } from './AuthPage';
import { useAuth } from '../../contexts/AuthContext';

// Mock du hook useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = useAuth as unknown as Mock;

// Mocks des fonctions d'auth
const signInWithEmail = vi.fn();
const signUpWithEmail = vi.fn();
const signInWithGoogle = vi.fn();
const signInWithGitHub = vi.fn();
const signOut = vi.fn();

// Setup par défaut pour chaque test
function setupDefaultAuthMock() {
  mockedUseAuth.mockReturnValue({
    user: null,
    session: null,
    loading: false,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
  });
}

beforeEach(() => {
  signInWithEmail.mockReset();
  signUpWithEmail.mockReset();
  signInWithGoogle.mockReset();
  signInWithGitHub.mockReset();
  signOut.mockReset();

  setupDefaultAuthMock();
});

describe('AuthPage', () => {
  // Affichage initial (login)
  it('affiche le formulaire de connexion par défaut', () => {
    render(<AuthPage />);

    // Champs requis
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();

    // Bouton submit (login)
    const submitBtn = screen.getByTestId('auth-submit-button');
    expect(submitBtn).toHaveTextContent(/se connecter/i);
  });

  // Login
  it('permet de se connecter et appelle signInWithEmail avec les bonnes valeurs', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'password123');

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(signInWithEmail).toHaveBeenCalledTimes(1);
    expect(signInWithEmail).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  // Signup
  it("permet de s'inscrire et appelle signUpWithEmail", async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'newpass');

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(signUpWithEmail).toHaveBeenCalledTimes(1);
    expect(signUpWithEmail).toHaveBeenCalledWith('new@example.com', 'newpass');
  });

  // Loading state
  it('affiche un message quand loading = true', () => {
    mockedUseAuth.mockReturnValueOnce({
      user: null,
      session: null,
      loading: true,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithGitHub,
      signOut,
    });

    render(<AuthPage />);

    expect(screen.getByText(/chargement de la session/i)).toBeInTheDocument();
  });

  // User déjà connecté
  it('affiche le message "déjà connecté" quand user est défini', () => {
    mockedUseAuth.mockReturnValueOnce({
      user: { email: 'logged@example.com' } as any,
      session: {} as any,
      loading: false,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithGitHub,
      signOut,
    });

    render(<AuthPage />);

    expect(
      screen.getByText(/tu es connecté·e en tant que/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/logged@example.com/i)).toBeInTheDocument();
  });

  // Login via Google
  it('appelle signInWithGoogle quand on clique sur le bouton Google', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    const googleBtn = screen.getByRole('button', {
      name: /continuer avec google/i,
    });

    await user.click(googleBtn);

    expect(signInWithGoogle).toHaveBeenCalledTimes(1);
  });

  // Login via GitHub
  it('appelle signInWithGitHub quand on clique sur le bouton GitHub', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    const githubBtn = screen.getByRole('button', {
      name: /continuer avec github/i,
    });

    await user.click(githubBtn);

    expect(signInWithGitHub).toHaveBeenCalledTimes(1);
  });

  // Logout
  it("appelle signOut quand on clique sur 'Se déconnecter'", async () => {
    const user = userEvent.setup();

    mockedUseAuth.mockReturnValueOnce({
      user: { email: 'logged@example.com' } as any,
      session: {} as any,
      loading: false,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithGitHub,
      signOut,
    });

    render(<AuthPage />);

    const logoutBtn = screen.getByRole('button', {
      name: /se déconnecter/i,
    });

    await user.click(logoutBtn);

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
