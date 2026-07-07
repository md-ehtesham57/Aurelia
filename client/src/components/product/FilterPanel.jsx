import { X } from 'lucide-react';

const FilterPanel = ({ filters, setFilters, onClose }) => {
  const metalTypes = ['gold', 'silver', 'platinum'];
  const purities = ['9K', '14K', '18K', '22K'];
  const occasions = ['Daily', 'Office', 'Party', 'Wedding', 'Festive'];

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const clearFilters = () => setFilters({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium">Filters</h3>
        <div className="flex items-center gap-2">
          <button onClick={clearFilters} className="text-xs text-text-muted hover:text-primary transition-colors">
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-bg rounded lg:hidden">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Metal</h4>
        <div className="space-y-1">
          {metalTypes.map((metal) => (
            <label key={metal} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.metal || []).includes(metal)}
                onChange={() => toggleFilter('metal', metal)}
                className="accent-primary"
              />
              {metal.charAt(0).toUpperCase() + metal.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Purity</h4>
        <div className="space-y-1">
          {purities.map((purity) => (
            <label key={purity} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.purity || []).includes(purity)}
                onChange={() => toggleFilter('purity', purity)}
                className="accent-primary"
              />
              {purity}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Occasion</h4>
        <div className="space-y-1">
          {occasions.map((occasion) => (
            <label key={occasion} className="flex items-center gap-2 text-sm text-text-muted hover:text-text cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.occasion || []).includes(occasion)}
                onChange={() => toggleFilter('occasion', occasion)}
                className="accent-primary"
              />
              {occasion}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
