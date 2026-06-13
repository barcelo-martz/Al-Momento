interface HeaderClientProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function HeaderClient({
  search,
  onSearchChange,
}: HeaderClientProps) {
  return (
    <div className="mb-6 mt-7">
      <h2 className="text-center text-2xl mb-4">¿Qué te apetece hoy?</h2>

      <div className="relative">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar plato..."
          className="w-full rounded-xl py-3 pl-12 pr-4 shadow-sm"
        />

        <span
          className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
          data-icon="search"
        >
          search
        </span>
      </div>
    </div>
  );
}
