import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { LoginForm } from './LoginForm';
import { useAuth } from '../../../contexts/AuthContext';

// Mock du hook useAuth
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = useAuth as unknown as Mock;
const signInWithEmail = vi.fn();

beforeEach(() => {
  signInWithEmail.mockReset();
  mockedUseAuth.mockReturnValue({
    signInWithEmail,
  });
});

describe('LoginForm', () => {
  it('affiche les champs et le bouton de connexion', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /se connecter/i })
    ).toBeInTheDocument();
  });

  it('appelle signInWithEmail avec les bonnes valeurs lors de la soumission', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'password123'
    );

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(signInWithEmail).toHaveBeenCalledTimes(1);
    expect(signInWithEmail).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  it('affiche un message de succès quand la connexion réussit', async () => {
    const user = userEvent.setup();
    // renvoie une promesse résolue
    signInWithEmail.mockResolvedValueOnce(undefined);

    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'password123'
    );

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(
      await screen.findByText(/connexion réussie ! vous pouvez cuisiner !/i)
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur quand signInWithEmail échoue", async () => {
    const user = userEvent.setup();
    signInWithEmail.mockRejectedValueOnce(new Error('Erreur de test'));

    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'password123'
    );

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(
      await screen.findByText(/une erreur est survenue lors de la connexion/i)
    ).toBeInTheDocument();
  });
});
