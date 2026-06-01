import type { FilterOptions } from '../utils/generator';
import { getOrigins } from '../utils/generator';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const origins = getOrigins();

  const handleChange = (key: keyof FilterOptions, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Gender</label>
        <select
          value={filters.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
        >
          <option value="all">All</option>
          <option value="boy">Boy</option>
          <option value="girl">Girl</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Style</label>
        <select
          value={filters.popularity}
          onChange={(e) => handleChange('popularity', e.target.value)}
        >
          <option value="all">All</option>
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
          <option value="trending">Trending</option>
          <option value="unique">Unique</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Origin</label>
        <select
          value={filters.origin}
          onChange={(e) => handleChange('origin', e.target.value)}
        >
          <option value="">Any</option>
          {origins.map(origin => (
            <option key={origin} value={origin}>{origin}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Starts with</label>
        <input
          type="text"
          maxLength={1}
          value={filters.startsWith}
          onChange={(e) => handleChange('startsWith', e.target.value)}
          placeholder="Any letter"
        />
      </div>

      <div className="filter-group">
        <label>How many? ({filters.count})</label>
        <input
          type="range"
          min="3"
          max="20"
          value={filters.count}
          onChange={(e) => handleChange('count', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
