import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { AuthPage } from './AuthPage';
import { useAuth } from '../../contexts/AuthContext';

// On mocke le hook useAuth pour contrôler l'état de l'auth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = useAuth as unknown as Mock;

// on garde des références sur les fonctions pour pouvoir les tester
const signInWithEmail = vi.fn();
const signUpWithEmail = vi.fn();
const signInWithGoogle = vi.fn();
const signOut = vi.fn();

function setupDefaultAuthMock() {
  mockedUseAuth.mockReturnValue({
    user: null,
    session: null,
    loading: false,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  });
}

beforeEach(() => {
  signInWithEmail.mockReset();
  signUpWithEmail.mockReset();
  signInWithGoogle.mockReset();
  signOut.mockReset();
  setupDefaultAuthMock();
});

describe('AuthPage', () => {
  it('affiche le formulaire de connexion par défaut', () => {
    render(<AuthPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it("permet de se connecter et appelle signInWithEmail avec les bonnes valeurs", async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    await user.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'password123'
    );

    await user.click(
      screen.getByTestId('auth-submit-button')
    );

    expect(signInWithEmail).toHaveBeenCalledTimes(1);
    expect(signInWithEmail).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  it("permet de s'inscrire et appelle signUpWithEmail", async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    // on passe en mode "S'inscrire"
    await user.click(
      screen.getByRole('button', { name: /s'inscrire/i })
    );

    await user.type(
      screen.getByLabelText(/email/i),
      'new@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'newpass'
    );

    await user.click(
      screen.getByRole('button', { name: /créer un compte/i })
    );

    expect(signUpWithEmail).toHaveBeenCalledTimes(1);
    expect(signUpWithEmail).toHaveBeenCalledWith(
      'new@example.com',
      'newpass'
    );
  });

  it('affiche un message quand loading = true', () => {
    mockedUseAuth.mockReturnValueOnce({
      user: null,
      session: null,
      loading: true,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    });

    render(<AuthPage />);

    expect(
      screen.getByText(/chargement de la session/i)
    ).toBeInTheDocument();
  });

  it('affiche le message "déjà connecté" quand user est défini', () => {
    mockedUseAuth.mockReturnValueOnce({
      user: { email: 'logged@example.com' } as any,
      session: {} as any,
      loading: false,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    });

    render(<AuthPage />);

    expect(
      screen.getByText(/tu es connecté·e en tant que/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/logged@example.com/i)
    ).toBeInTheDocument();
  });
});
