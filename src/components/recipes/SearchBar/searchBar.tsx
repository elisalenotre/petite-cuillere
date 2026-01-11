// ------- Barre de recherche --------
// Filtre les recettes par titre.
type Props = {
  search: string;
  setSearch: (s: string) => void;
};

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="Rechercher une recette..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}