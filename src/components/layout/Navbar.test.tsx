import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

// 1) Mock du hook useAuth
const signOutMock = vi.fn();

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    signOut: signOutMock,
  }),
}));

// 2) Mock du svg import
vi.mock("../../assets/spoon.svg", () => ({
  default: "spoon.svg",
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setup() {
    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  }

  it("affiche le lien vers /recipes avec aria-label", () => {
    setup();

    const brandLink = screen.getByRole("link", { name: /aller aux recettes/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute("href", "/recipes");

    expect(screen.getByText(/petite cuillère/i)).toBeInTheDocument();
  });

  it("appelle signOut quand on clique sur 'Se déconnecter'", async () => {
    signOutMock.mockResolvedValueOnce(undefined);
    setup();

    const user = userEvent.setup();
    const btn = screen.getByRole("button", { name: /se déconnecter/i });

    await user.click(btn);

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("affiche un message d'erreur si signOut échoue", async () => {
    signOutMock.mockRejectedValueOnce(new Error("boom"));
    setup();

    const user = userEvent.setup();
    const btn = screen.getByRole("button", { name: /se déconnecter/i });

    await user.click(btn);

    expect(await screen.findByText(/impossible de se déconnecter/i)).toBeInTheDocument();
  });
});
