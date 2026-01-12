import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination", () => {
  let setPage: Mock;

  beforeEach(() => {
    setPage = vi.fn();
  });

  function setup(props?: Partial<React.ComponentProps<typeof Pagination>>) {
    const defaultProps = {
      page: 1,
      setPage,
      total: 60,   
      pageSize: 10,
    };

    return render(<Pagination {...defaultProps} {...props} />);
  }

  it("affiche la bonne page active via les pilules", () => {
    setup({ page: 2, total: 60, pageSize: 10 });
    const active = screen.getByRole("button", { name: "Page 2" });
    expect(active).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText(/Page\s+\d+\s+\/\s+\d+/)).not.toBeInTheDocument();
  });

  it("désactive 'Précédent' sur la première page", async () => {
    setup({ page: 1, total: 60, pageSize: 10 });

    const user = userEvent.setup();
    const prevBtn = screen.getByRole("button", { name: /page précédente/i });

    expect(prevBtn).toBeDisabled();

    await user.click(prevBtn);
    expect(setPage).not.toHaveBeenCalled();
  });

  it("désactive 'Suivant' sur la dernière page", async () => {
    setup({ page: 6, total: 60, pageSize: 10 });

    const user = userEvent.setup();
    const nextBtn = screen.getByRole("button", { name: /page suivante/i });

    expect(nextBtn).toBeDisabled();

    await user.click(nextBtn);
    expect(setPage).not.toHaveBeenCalled();
  });

  it("clique sur 'Suivant' appelle setPage(page + 1)", async () => {
    setup({ page: 2, total: 60, pageSize: 10 });

    const user = userEvent.setup();
    const nextBtn = screen.getByRole("button", { name: /page suivante/i });

    await user.click(nextBtn);
    expect(setPage).toHaveBeenCalledWith(3);
  });

  it("clique sur 'Précédent' appelle setPage(page - 1)", async () => {
    setup({ page: 3, total: 60, pageSize: 10 });

    const user = userEvent.setup();
    const prevBtn = screen.getByRole("button", { name: /page précédente/i });

    await user.click(prevBtn);
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("affiche toutes les pages quand totalPages <= 5", () => {
    setup({ page: 1, total: 50, pageSize: 10 });

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("button", { name: `Page ${i}` })).toBeInTheDocument();
    }

    expect(screen.queryByRole("button", { name: "Page ..." })).not.toBeInTheDocument();
  });

  it("affiche '...' quand totalPages > 5 et page au début (page <= 3)", () => {
    setup({ page: 2, total: 100, pageSize: 10 });

    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 4" })).toBeInTheDocument();

    const dots = screen.getByRole("button", { name: "Page ..." });
    expect(dots).toBeDisabled();

    expect(screen.getByRole("button", { name: "Page 10" })).toBeInTheDocument();
  });

  it("affiche '...' quand on est au milieu", () => {
    setup({ page: 5, total: 100, pageSize: 10 });

    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 6" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 10" })).toBeInTheDocument();

    const dots = screen.getAllByRole("button", { name: "Page ..." });
    expect(dots).toHaveLength(2);
    dots.forEach((d) => expect(d).toBeDisabled());
  });

  it("clic sur un numéro de page appelle setPage(pageNum)", async () => {
    setup({ page: 1, total: 60, pageSize: 10 });

    const user = userEvent.setup();
    const page3 = screen.getByRole("button", { name: "Page 3" });

    await user.click(page3);
    expect(setPage).toHaveBeenCalledWith(3);
  });

  it("met aria-current='page' sur la page active", () => {
    setup({ page: 3, total: 60, pageSize: 10 });

    const active = screen.getByRole("button", { name: "Page 3" });
    expect(active).toHaveAttribute("aria-current", "page");
  });
});
