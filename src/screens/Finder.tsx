import { useState } from 'react';
import { FilterPanel } from '../components/FilterPanel';
import { NameCard } from '../components/NameCard';
import { Stork } from '../components/Art';
import { defaultFilters, filterNames, generateNames } from '../utils/generator';
import type { FilterOptions } from '../utils/generator';
import type { BabyName } from '../data/names';
import { useStored } from '../lib/storage';
import { sfx } from '../lib/sound';
import { burstConfetti } from '../lib/confetti';

interface FinderProps {
  saved: string[];
  surname: string;
  onSurnameChange: (s: string) => void;
  onToggleSave: (name: string) => void;
}

export function Finder({ saved, surname, onSurnameChange, onToggleSave }: FinderProps) {
  const [filters, setFilters] = useStored<FilterOptions>('bng-filters', defaultFilters);
  const [names, setNames] = useState<BabyName[] | null>(null);
  const [shaking, setShaking] = useState(false);
  const matchCount = filterNames(filters).length;

  const generate = (e: React.MouseEvent) => {
    sfx.rattle();
    setShaking(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    window.setTimeout(() => {
      setShaking(false);
      const result = generateNames(filters);
      setNames(result);
      if (result.length) {
        sfx.chime();
        burstConfetti(['#b8e0d2', '#ffc4a3', '#c3b1e1', '#ffd95a', '#a8d8ff'], 60, {
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }
    }, 450);
  };

  return (
    <div className="screen">
      <section className="hero">
        <Stork className="hero-stork" size={200} />
        <div>
          <h1>
            Find a name <span className="squiggle">you both love</span>
          </h1>
          <p className="lead">
            Pick a few options, shake the rattle, and save the names that make you smile.{' '}
            <span className="muted">{matchCount} names match right now.</span>
          </p>
        </div>
      </section>

      <FilterPanel filters={filters} onFilterChange={setFilters} surname={surname} onSurnameChange={onSurnameChange} />

      <div className="generate-wrap">
        <button className={`big-btn ${shaking ? 'shake' : ''}`} onClick={generate} disabled={matchCount === 0}>
          <span className="btn-rattle">🪇</span> {names ? 'Shake again' : 'Shake the rattle'}
        </button>
        {matchCount === 0 && <p className="muted">No names match. Remove a filter to see more.</p>}
      </div>

      {names && (
        <section className="results" aria-live="polite">
          {names.length > 0 ? (
            <div className="names-grid">
              {names.map((n, i) => (
                <NameCard
                  key={`${n.name}-${i}`}
                  name={n}
                  index={i}
                  saved={saved.includes(n.name)}
                  surname={surname.trim()}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          ) : (
            <p className="empty">No names found. Try fewer filters.</p>
          )}
        </section>
      )}
    </div>
  );
}
