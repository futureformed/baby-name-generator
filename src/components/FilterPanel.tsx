import type { FilterOptions, GenderFilter, StyleFilter, SyllableFilter } from '../utils/generator';
import { getOrigins } from '../utils/generator';
import { sfx } from '../lib/sound';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  surname: string;
  onSurnameChange: (surname: string) => void;
}

const GENDERS: { value: GenderFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All names', icon: '🌈' },
  { value: 'girl', label: 'Girl', icon: '🐰' },
  { value: 'boy', label: 'Boy', icon: '🐻' },
  { value: 'unisex', label: 'Neutral only', icon: '🐥' },
];

const STYLES: { value: StyleFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'Any style', icon: '🎈' },
  { value: 'classic', label: 'Classic', icon: '📜' },
  { value: 'modern', label: 'Modern', icon: '🪁' },
  { value: 'trending', label: 'Trending', icon: '🔥' },
  { value: 'unique', label: 'Unique', icon: '🦄' },
];

const SYLLABLES: { value: SyllableFilter; label: string }[] = [
  { value: 0, label: 'Any' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3+' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const BLOCK_TINTS = ['mint', 'peach', 'lavender', 'butter', 'sky'];
const origins = getOrigins();

export function FilterPanel({ filters, onFilterChange, surname, onSurnameChange }: FilterPanelProps) {
  const set = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    sfx.tap();
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <section className="filter-panel card">
      <div className="filter-row">
        <span className="filter-label">Who is it for?</span>
        <div className="chips" role="radiogroup" aria-label="Gender">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              role="radio"
              aria-checked={filters.gender === g.value}
              className={`chip ${filters.gender === g.value ? 'on' : ''}`}
              onClick={() => set('gender', g.value)}
            >
              <span className="chip-icon">{g.icon}</span> {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">Style</span>
        <div className="chips" role="radiogroup" aria-label="Style">
          {STYLES.map((s) => (
            <button
              key={s.value}
              role="radio"
              aria-checked={filters.popularity === s.value}
              className={`chip ${filters.popularity === s.value ? 'on' : ''}`}
              onClick={() => set('popularity', s.value)}
            >
              <span className="chip-icon">{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-grid">
        <div className="filter-row">
          <span className="filter-label">Syllables</span>
          <div className="chips" role="radiogroup" aria-label="Syllables">
            {SYLLABLES.map((s) => (
              <button
                key={s.value}
                role="radio"
                aria-checked={filters.syllables === s.value}
                className={`chip small ${filters.syllables === s.value ? 'on' : ''}`}
                onClick={() => set('syllables', s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label className="filter-row">
          <span className="filter-label">Origin</span>
          <select className="soft-input" value={filters.origin} onChange={(e) => set('origin', e.target.value)}>
            <option value="">Anywhere in the world 🌍</option>
            {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-row">
          <span className="filter-label">Your surname (optional)</span>
          <input
            className="soft-input"
            value={surname}
            onChange={(e) => onSurnameChange(e.target.value)}
            placeholder="e.g. Rivers"
            maxLength={40}
          />
        </label>

        <label className="filter-row">
          <span className="filter-label">How many? <b>{filters.count}</b></span>
          <input
            className="range"
            type="range"
            min={3}
            max={24}
            value={filters.count}
            onChange={(e) => set('count', Number(e.target.value))}
          />
        </label>
      </div>

      <div className="filter-row">
        <span className="filter-label">Starts with</span>
        <div className="letter-blocks" role="radiogroup" aria-label="First letter">
          {LETTERS.map((l, i) => (
            <button
              key={l}
              role="radio"
              aria-checked={filters.startsWith === l}
              className={`letter-block tint-${BLOCK_TINTS[i % BLOCK_TINTS.length]} ${filters.startsWith === l ? 'on' : ''}`}
              onClick={() => set('startsWith', filters.startsWith === l ? '' : l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
