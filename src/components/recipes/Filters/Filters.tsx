// ------- Filtres et tri des recettes --------
// Sélecteurs (régime, temps, technique, difficulté) et tri.
import React from "react";

export type SortValue = "date-desc" | "date-asc" | "alpha-asc" | "alpha-desc";

type Props = {
  selectedFilters: {
    regime: string;
    temps: string;
    tech_cuisson: string;
    difficulty: string;
    owner: string; // "" | "mine" | "others"
  };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{
      regime: string;
      temps: string;
      tech_cuisson: string;
      difficulty: string;
      owner: string;
    }>
  >;
  options: {
    regime: string[];
    temps: string[];
    tech_cuisson: string[];
    difficulty: string[];
  };

  sort: SortValue;
  setSort: React.Dispatch<React.SetStateAction<SortValue>>;
};

export default function Filters({
  selectedFilters,
  setSelectedFilters,
  options,
  sort,
  setSort,
}: Props) {
  return (
    <div className="filters-wrapper">
      {/* Auteur (propriétaire) */}
      <select
        aria-label="Filtre auteur"
        value={selectedFilters.owner}
        onChange={(e) =>
          setSelectedFilters((prev) => ({ ...prev, owner: e.target.value }))
        }
      >
        <option value="">Tous</option>
        <option value="mine">Mes recettes</option>
        <option value="others">Recettes des autres</option>
      </select>

      {/* TRI */}
      <select
        aria-label="Tri des recettes"
        value={sort}
        onChange={(e) => setSort(e.target.value as SortValue)}
      >
        <option value="date-desc">Les plus récentes</option>
        <option value="date-asc">Les plus anciennes</option>
        <option value="alpha-asc">A → Z</option>
        <option value="alpha-desc">Z → A</option>
      </select>

      {/* Régime */}
      <select
        aria-label="Filtre régime"
        value={selectedFilters.regime}
        onChange={(e) =>
          setSelectedFilters((prev) => ({ ...prev, regime: e.target.value }))
        }
      >
        <option value="">Régime</option>
        {options.regime.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {/* Temps de cuisson */}
      <select
        aria-label="Filtre temps"
        value={selectedFilters.temps}
        onChange={(e) =>
          setSelectedFilters((prev) => ({ ...prev, temps: e.target.value }))
        }
      >
        <option value="">Temps de cuisson</option>
        {options.temps.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Technique de cuisson */}
      <select
        aria-label="Filtre technique de cuisson"
        value={selectedFilters.tech_cuisson}
        onChange={(e) =>
          setSelectedFilters((prev) => ({
            ...prev,
            tech_cuisson: e.target.value,
          }))
        }
      >
        <option value="">Tech de cuisson</option>
        {options.tech_cuisson.map((tc) => (
          <option key={tc} value={tc}>
            {tc}
          </option>
        ))}
      </select>

      {/* Difficulté */}
      <select
        aria-label="Filtre difficulté"
        value={selectedFilters.difficulty}
        onChange={(e) =>
          setSelectedFilters((prev) => ({
            ...prev,
            difficulty: e.target.value,
          }))
        }
      >
        <option value="">Difficulté</option>
        {options.difficulty.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}
