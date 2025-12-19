import React from "react";

type Props = {
  selectedFilters: {
    regime: string;
    temps: string;
    tech_cuisson: string;
    difficulty: string;
  };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{
      regime: string;
      temps: string;
      tech_cuisson: string;
      difficulty: string;
    }>
  >;
  options: {
    regime: string[];
    temps: string[];
    tech_cuisson: string[];
    difficulty: string[];
  };
};

export default function Filters({ selectedFilters, setSelectedFilters, options }: Props) {
  return (
    <div className="filters-wrapper">
      {/* Régime */}
      <select
        value={selectedFilters.regime}
        onChange={(e) =>
          setSelectedFilters((prev) => ({ ...prev, regime: e.target.value }))
        }
      >
        <option value="">Régime</option>
        {options.regime.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {/* Temps de cuisson */}
      <select
        value={selectedFilters.temps}
        onChange={(e) =>
          setSelectedFilters((prev) => ({ ...prev, temps: e.target.value }))
        }
      >
        <option value="">Temps de cuisson</option>
        {options.temps.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Technique de cuisson */}
      <select
        value={selectedFilters.tech_cuisson}
        onChange={(e) =>
          setSelectedFilters((prev) => ({ ...prev, tech_cuisson: e.target.value }))
        }
      >
        <option value="">Tech de cuisson</option>
        {options.tech_cuisson.map((tc) => (
          <option key={tc} value={tc}>{tc}</option>
        ))}
      </select>

      {/* Difficulté */}
      <select
        value={selectedFilters.difficulty}
        onChange={(e) =>
          setSelectedFilters((prev) => ({ ...prev, difficulty: e.target.value }))
        }
      >
        <option value="">Difficulté</option>
        {options.difficulty.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}
