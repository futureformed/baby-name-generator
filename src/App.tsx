import { useState } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { NameCard } from './components/NameCard';
import { generateNames } from './utils/generator';
import type { FilterOptions } from './utils/generator';
import type { BabyName } from './data/names';
import './App.css';

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    gender: 'all',
    popularity: 'all',
    origin: '',
    startsWith: '',
    count: 8,
  });

  const [names, setNames] = useState<BabyName[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    const generated = generateNames(filters);
    setNames(generated);
    setHasGenerated(true);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Baby Name Generator</h1>
        <p>Find the perfect name for your little one</p>
      </header>

      <main className="main">
        <FilterPanel filters={filters} onFilterChange={setFilters} />

        <button className="generate-btn" onClick={handleGenerate}>
          Generate Names
        </button>

        {hasGenerated && (
          <div className="results">
            {names.length > 0 ? (
              <>
                <h2 className="results-title">Here are your suggestions</h2>
                <div className="names-grid">
                  {names.map((name) => (
                    <NameCard key={name.name} name={name} />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>No names found with those filters. Try adjusting your criteria!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Made with love for parents-to-be</p>
      </footer>
    </div>
  );
}

export default App;
