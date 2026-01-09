import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
  it("affiche le titre de la page d'erreur", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/oups, cette page est introuvable/i)
    ).toBeInTheDocument();
  });

  it("affiche le texte d'explication", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/tu t'es emmêlé·e les cuillères/i)
    ).toBeInTheDocument();
  });

  it("affiche un lien permettant de retourner en cuisine", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /cuisine|recettes|retour/i });
    expect(link).toHaveAttribute("href", "/recipes");
  });

});
