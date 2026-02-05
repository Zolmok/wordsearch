import { CATEGORIES } from '../data/wordLists.js';

export default function CategoryPicker({ value, onChange }) {
  const categories = Object.entries(CATEGORIES);

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-dim mb-3 uppercase tracking-wider">
        Category
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {categories.map(([key, cat]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
              value === key
                ? 'border-cyan bg-cyan/10 text-cyan glow-border'
                : 'border-border-glow text-text-dim hover:border-cyan/50 hover:text-text'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
