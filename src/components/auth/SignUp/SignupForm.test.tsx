import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { SignupForm } from './SignupForm';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// Mock du hook useAuth
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = useAuth as unknown as Mock;
const signUpWithEmail = vi.fn();

beforeEach(() => {
  signUpWithEmail.mockReset();
  mockedUseAuth.mockReturnValue({
    signUpWithEmail,
  });
});

describe('SignupForm', () => {
  it("affiche les champs et le bouton 'Créer un compte'", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /créer un compte/i })
    ).toBeInTheDocument();
  });

  it('appelle signUpWithEmail avec les bonnes valeurs lors de la soumission', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/email/i),
      'new@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'newpass'
    );

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(signUpWithEmail).toHaveBeenCalledTimes(1);
    expect(signUpWithEmail).toHaveBeenCalledWith(
      'new@example.com',
      'newpass'
    );
  });

  it("affiche un message de succès quand l'inscription réussit", async () => {
    const user = userEvent.setup();
    signUpWithEmail.mockResolvedValueOnce(undefined);

    // Mock supabase pour éviter un appel réseau et forcer 'session' à null
    vi.mock('../../../supabase', () => ({
      supabase: {
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        },
      },
    }));

    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/email/i),
      'new@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'newpass'
    );

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(
      await screen.findByText(/regardez vos mails et confirmez votre adresse email/i)
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur quand signUpWithEmail échoue", async () => {
    const user = userEvent.setup();
    signUpWithEmail.mockRejectedValueOnce(new Error('Erreur signup'));

    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/email/i),
      'new@example.com'
    );
    await user.type(
      screen.getByLabelText(/mot de passe/i),
      'newpass'
    );

    await user.click(screen.getByTestId('auth-submit-button'));

    expect(
      await screen.findByText(/erreur signup/i)
    ).toBeInTheDocument();
  });
});
