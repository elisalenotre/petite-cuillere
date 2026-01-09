import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./searchBar";

describe("SearchBar", () => {
  it("appelle setSearch avec la valeur tapée", () => {
    const setSearch = vi.fn();

    render(<SearchBar search="" setSearch={setSearch} />);

    const input = screen.getByPlaceholderText(/rechercher une recette/i);

    fireEvent.change(input, { target: { value: "ramen" } });

    expect(setSearch).toHaveBeenCalledWith("ramen");
  });

  it("affiche la valeur passée en props", () => {
    render(<SearchBar search="pesto" setSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/rechercher une recette/i) as HTMLInputElement;
    expect(input.value).toBe("pesto");
  });
});
