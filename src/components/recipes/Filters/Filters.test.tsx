import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import Filters, { type SortValue } from "./Filters";

type FiltersState = {
  owner: string;
  regime: string;
  temps: string;
  tech_cuisson: string;
  difficulty: string;
};

const options = {
  regime: ["Végétarien", "Vegan"],
  temps: ["Rapide", "Moins de 30 min"],
  tech_cuisson: ["Four", "Poêle"],
  difficulty: ["Facile", "Difficile"],
};

function Wrapper({
  initialFilters,
  initialSort = "date-desc",
  onSortSpy,
}: {
  initialFilters?: FiltersState;
  initialSort?: SortValue;
  onSortSpy?: (v: SortValue) => void;
}) {
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>(
    initialFilters ?? {
      owner: "",
      regime: "",
      temps: "",
      tech_cuisson: "",
      difficulty: "",
    }
  );

  const [sort, setSort] = useState<SortValue>(initialSort);

  const handleSort = (v: React.SetStateAction<SortValue>) => {
    const next = typeof v === "function" ? (v as any)(sort) : v;
    onSortSpy?.(next);
    setSort(v);
  };

  return (
    <Filters
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      options={options}
      sort={sort}
      setSort={handleSort}
    />
  );
}

describe("Filters (integration simple)", () => {
  it("permet de changer le filtre régime (la valeur du select se met à jour)", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const select = screen.getByLabelText(/filtre régime/i) as HTMLSelectElement;

    // valeur initiale
    expect(select.value).toBe("");

    // change -> Vegan
    await user.selectOptions(select, "Vegan");
    expect(select.value).toBe("Vegan");
  });

  it("permet de changer plusieurs filtres", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await user.selectOptions(screen.getByLabelText(/filtre temps/i), "Rapide");
    await user.selectOptions(
      screen.getByLabelText(/filtre technique de cuisson/i),
      "Four"
    );

    expect((screen.getByLabelText(/filtre temps/i) as HTMLSelectElement).value).toBe("Rapide");
    expect((screen.getByLabelText(/filtre technique de cuisson/i) as HTMLSelectElement).value).toBe("Four");
  });

  it("permet de changer le tri", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();

    render(<Wrapper onSortSpy={spy} />);

    const sortSelect = screen.getByLabelText(/tri des recettes/i) as HTMLSelectElement;

    expect(sortSelect.value).toBe("date-desc");

    await user.selectOptions(sortSelect, "alpha-asc");

    expect(sortSelect.value).toBe("alpha-asc");
    expect(spy).toHaveBeenCalledWith("alpha-asc");
  });
});
