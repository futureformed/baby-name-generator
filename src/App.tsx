import { useCallback, useEffect, useState } from 'react';
import { Decor } from './components/Decor';
import { Rattle } from './components/Art';
import { Finder } from './screens/Finder';
import { Shortlist } from './screens/Shortlist';
import { Match } from './screens/Match';
import { Shower } from './screens/Shower';
import { decodeParty } from './lib/party';
import type { Party } from './lib/party';
import { useStored } from './lib/storage';
import { isMuted, setMuted, sfx } from './lib/sound';
import './App.css';

type Route = 'find' | 'shortlist' | 'match' | 'shower';
const ROUTES: { id: Route; label: string; icon: string }[] = [
  { id: 'find', label: 'Find names', icon: '🔍' },
  { id: 'shortlist', label: 'Shortlist', icon: '💖' },
  { id: 'match', label: 'Partner match', icon: '💞' },
  { id: 'shower', label: 'Shower games', icon: '🎉' },
];

function readHash(): { route: Route; party: Party | null } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('reveal/')) return { route: 'shower', party: decodeParty(hash.slice(7)) };
  const route = ROUTES.find((r) => r.id === hash)?.id ?? 'find';
  return { route, party: null };
}

function App() {
  const [{ route, party: sharedParty }, setNav] = useState(readHash);
  const [saved, setSaved] = useStored<string[]>('bng-saved', []);
  const [surname, setSurname] = useStored<string>('bng-surname', '');
  const [presetName, setPresetName] = useState('');
  const [muted, setMutedState] = useState(isMuted());
  const [wiggle, setWiggle] = useState(false);

  useEffect(() => {
    const onHash = () => setNav(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goTo = (r: string) => {
    window.location.hash = r;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSave = (name: string) =>
    setSaved(saved.includes(name) ? saved.filter((n) => n !== name) : [...saved, name]);

  const clearShared = useCallback(() => {
    history.replaceState(null, '', '#shower');
    setNav({ route: 'shower', party: null });
  }, []);
  const clearPreset = useCallback(() => setPresetName(''), []);

  return (
    <div className="app">
      <Decor />
      <header className="topbar">
        <button
          className={`logo ${wiggle ? 'wiggle-once' : ''}`}
          onClick={() => {
            sfx.lullaby();
            setWiggle(true);
            window.setTimeout(() => setWiggle(false), 700);
            goTo('find');
          }}
          aria-label="Little Names home"
        >
          <Rattle size={34} />
          <span>
            Little<b>Names</b>
          </span>
        </button>
        <nav className="tabs" aria-label="Main">
          {ROUTES.map((r) => (
            <button
              key={r.id}
              className={`tab ${route === r.id ? 'on' : ''}`}
              aria-current={route === r.id ? 'page' : undefined}
              onClick={() => {
                sfx.tap();
                goTo(r.id);
              }}
            >
              <span className="tab-icon">{r.icon}</span>
              <span className="tab-label">{r.label}</span>
              {r.id === 'shortlist' && saved.length > 0 && <span className="badge">{saved.length}</span>}
            </button>
          ))}
        </nav>
        <button
          className="icon-btn mute"
          onClick={() => {
            setMuted(!muted);
            setMutedState(!muted);
            if (muted) window.setTimeout(() => sfx.chime(), 50);
          }}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          title={muted ? 'Sound off' : 'Sound on'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </header>

      <main className="main" key={route}>
        {route === 'find' && (
          <Finder saved={saved} surname={surname} onSurnameChange={setSurname} onToggleSave={toggleSave} />
        )}
        {route === 'shortlist' && (
          <Shortlist
            saved={saved}
            setSaved={setSaved}
            surname={surname}
            onSurnameChange={setSurname}
            onUseInShower={(n) => {
              setPresetName(n);
              goTo('shower');
            }}
            goTo={goTo}
          />
        )}
        {route === 'match' && <Match saved={saved} setSaved={setSaved} />}
        {route === 'shower' && (
          <Shower
            presetName={presetName}
            clearPreset={clearPreset}
            shortlist={saved}
            sharedParty={sharedParty}
            clearShared={clearShared}
          />
        )}
      </main>

      <footer className="footer">
        <p>Made with 🍼 for parents-to-be · Your lists stay on this device</p>
      </footer>
    </div>
  );
}

export default App;
