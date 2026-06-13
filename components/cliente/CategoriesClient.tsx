interface Props {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-auto mb-5 overflow-x-auto scrollbar-none">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-1 rounded-full ${
            selected === category ? "bg-orange-600 text-white" : "bg-gray-100"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
