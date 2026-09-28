import { useEffect, useRef, useState } from 'react';
import { Heart, Pram } from '../components/Art';
import { GENDER_LABEL, filterNames, findName, defaultFilters } from '../utils/generator';
import type { GenderFilter } from '../utils/generator';
import { useStored } from '../lib/storage';
import { sfx, speak } from '../lib/sound';
import { burstConfetti } from '../lib/confetti';

interface MatchState {
  players: [string, string];
  gender: GenderFilter;
  size: number;
  deck: string[];
  votes: [Record<string, boolean>, Record<string, boolean>];
  phase: 'setup' | 'handoff' | 'swipe' | 'results';
  turn: 0 | 1;
  pos: number;
}

const initial: MatchState = {
  players: ['Parent 1', 'Parent 2'],
  gender: 'all',
  size: 20,
  deck: [],
  votes: [{}, {}],
  phase: 'setup',
  turn: 0,
  pos: 0,
};

interface MatchProps {
  saved: string[];
  setSaved: (names: string[]) => void;
}

export function Match({ saved, setSaved }: MatchProps) {
  const [s, setS] = useStored<MatchState>('bng-match', initial);
  const update = (patch: Partial<MatchState>) => setS({ ...s, ...patch });

  const start = () => {
    const pool = filterNames({ ...defaultFilters, gender: s.gender });
    const deck = pool
      .map((n) => ({ n: n.name, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .slice(0, s.size)
      .map((x) => x.n);
    sfx.chime();
    update({ deck, votes: [{}, {}], phase: 'handoff', turn: 0, pos: 0 });
  };

  const vote = (yes: boolean) => {
    const name = s.deck[s.pos];
    if (yes) sfx.yes();
    else sfx.boing();
    const votes: MatchState['votes'] = [{ ...s.votes[0] }, { ...s.votes[1] }];
    votes[s.turn][name] = yes;
    const pos = s.pos + 1;
    if (pos < s.deck.length) return update({ votes, pos });
    if (s.turn === 0) return update({ votes, pos: 0, turn: 1, phase: 'handoff' });
    update({ votes, phase: 'results' });
  };

  if (s.phase === 'setup') {
    return (
      <div className="screen">
        <section className="hero">
          <Pram className="hero-stork bob" size={160} />
          <div>
            <h1>Partner match <span className="squiggle">💞</span></h1>
            <p className="lead">
              Each parent swipes the same names in secret. At the end you see only the names you <b>both</b> love.
              No arguments, no pressure.
            </p>
          </div>
        </section>
        <section className="card setup-card">
          <div className="two-col">
            {[0, 1].map((i) => (
              <label key={i} className="filter-row">
                <span className="filter-label">Player {i + 1}</span>
                <input
                  className="soft-input"
                  value={s.players[i]}
                  maxLength={20}
                  onChange={(e) => {
                    const players: [string, string] = [...s.players];
                    players[i] = e.target.value;
                    update({ players });
                  }}
                />
              </label>
            ))}
          </div>
          <div className="filter-row">
            <span className="filter-label">Which names?</span>
            <div className="chips">
              {(['all', 'girl', 'boy', 'unisex'] as GenderFilter[]).map((g) => (
                <button key={g} className={`chip ${s.gender === g ? 'on' : ''}`} onClick={() => { sfx.tap(); update({ gender: g }); }}>
                  {g === 'all' ? '🌈 All' : g === 'girl' ? '🐰 Girl' : g === 'boy' ? '🐻 Boy' : '🐥 Neutral'}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">How many names each?</span>
            <div className="chips">
              {[10, 20, 40].map((n) => (
                <button key={n} className={`chip ${s.size === n ? 'on' : ''}`} onClick={() => { sfx.tap(); update({ size: n }); }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button className="big-btn" onClick={start}>Start matching</button>
        </section>
      </div>
    );
  }

  if (s.phase === 'handoff') {
    return (
      <div className="screen center-screen">
        <div className="handoff-emoji bob">🤫</div>
        <h1>Pass the phone to {s.players[s.turn] || `Player ${s.turn + 1}`}</h1>
        <p className="lead">{s.turn === 1 ? `${s.players[0]} is done. No peeking at their answers!` : 'Swipe right for love, left for no.'}</p>
        <button className="big-btn" onClick={() => { sfx.tap(); update({ phase: 'swipe' }); }}>I'm {s.players[s.turn]}, let's go</button>
        <button className="link-btn" onClick={() => update({ phase: 'setup' })}>Start over</button>
      </div>
    );
  }

  if (s.phase === 'swipe') {
    return <SwipeDeck state={s} onVote={vote} />;
  }

  const matches = s.deck.filter((n) => s.votes[0][n] && s.votes[1][n]);
  const maybes = s.deck.filter((n) => s.votes[0][n] !== s.votes[1][n]);
  const newMatches = matches.filter((m) => !saved.includes(m));

  return (
    <Results
      matches={matches}
      maybes={maybes}
      players={s.players}
      votes={s.votes}
      onSave={() => { sfx.squeak(); setSaved([...saved, ...newMatches]); }}
      allSaved={newMatches.length === 0}
      onAgain={() => update({ phase: 'setup' })}
    />
  );
}

function Results({ matches, maybes, players, votes, onSave, allSaved, onAgain }: {
  matches: string[];
  maybes: string[];
  players: [string, string];
  votes: MatchState['votes'];
  onSave: () => void;
  allSaved: boolean;
  onAgain: () => void;
}) {
  useEffect(() => {
    if (matches.length) {
      sfx.fanfare();
      burstConfetti(['#ff9eb1', '#ffd95a', '#c3b1e1', '#b8e0d2'], 180);
    }
  }, [matches.length]);

  return (
    <div className="screen">
      <section className="page-head">
        <div>
          <h1>{matches.length ? `It's a match! ${matches.length} ${matches.length === 1 ? 'name' : 'names'}` : 'No matches this time'}</h1>
          <p className="lead">{matches.length ? 'You both said yes to these.' : 'Try again with more names, or a different set.'}</p>
        </div>
        <div className="head-actions">
          {matches.length > 0 && (
            <button className="soft-btn" onClick={onSave} disabled={allSaved}>{allSaved ? '💖 Saved' : '💖 Save to shortlist'}</button>
          )}
          <button className="soft-btn" onClick={onAgain}>🔁 Play again</button>
        </div>
      </section>
      <div className="match-grid">
        {matches.map((m, i) => (
          <div key={m} className="match-bubble" style={{ animationDelay: `${i * 90}ms` }}>
            <Heart size={26} />
            <span>{m}</span>
            <button className="icon-btn" onClick={() => speak(m)} aria-label={`Hear ${m}`}>🔊</button>
          </div>
        ))}
      </div>
      {maybes.length > 0 && (
        <section className="card maybes">
          <h2>Worth a chat</h2>
          <p className="muted">Only one of you liked these.</p>
          <div className="maybe-list">
            {maybes.map((m) => (
              <span key={m} className="maybe-chip">
                {m} <small>({votes[0][m] ? players[0] : players[1]})</small>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SwipeDeck({ state, onVote }: { state: MatchState; onVote: (yes: boolean) => void }) {
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<null | 'left' | 'right'>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const name = state.deck[state.pos];
  const info = findName(name);

  const decide = (yes: boolean) => {
    if (leaving) return;
    setLeaving(yes ? 'right' : 'left');
    window.setTimeout(() => {
      setLeaving(null);
      setDx(0);
      onVote(yes);
    }, 260);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') decide(true);
      if (e.key === 'ArrowLeft') decide(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const transform = leaving
    ? `translateX(${leaving === 'right' ? 140 : -140}%) rotate(${leaving === 'right' ? 25 : -25}deg)`
    : `translateX(${dx}px) rotate(${dx / 14}deg)`;

  return (
    <div className="screen center-screen">
      <p className="muted">
        {state.players[state.turn]} · {state.pos + 1} of {state.deck.length}
      </p>
      <div className="progress"><div style={{ width: `${(state.pos / state.deck.length) * 100}%` }} /></div>
      <div className="deck">
        {state.deck[state.pos + 1] && <div className="swipe-card behind">{state.deck[state.pos + 1]}</div>}
        <div
          key={name}
          className={`swipe-card ${dragging ? 'dragging' : ''}`}
          style={{ transform }}
          onPointerDown={(e) => {
            startX.current = e.clientX;
            setDragging(true);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => startX.current !== null && setDx(e.clientX - startX.current)}
          onPointerUp={() => {
            startX.current = null;
            setDragging(false);
            if (dx > 90) decide(true);
            else if (dx < -90) decide(false);
            else setDx(0);
          }}
        >
          <span className="stamp yes" style={{ opacity: Math.max(0, dx / 90) }}>LOVE</span>
          <span className="stamp no" style={{ opacity: Math.max(0, -dx / 90) }}>NOPE</span>
          {info && <span className={`tag tag-${info.gender}`}>{GENDER_LABEL[info.gender]}</span>}
          <h2>{name}</h2>
          {info && <p className="meaning">“{info.meaning}”</p>}
          {info && <p className="muted small">{info.origin} · {info.popularity}</p>}
          <button className="icon-btn" onPointerDown={(e) => e.stopPropagation()} onClick={() => speak(name)} aria-label={`Hear ${name}`}>🔊</button>
        </div>
      </div>
      <div className="swipe-buttons">
        <button className="round-btn no" onClick={() => decide(false)} aria-label="Not for us">👎</button>
        <button className="round-btn yes" onClick={() => decide(true)} aria-label="Love it">💛</button>
      </div>
      <p className="muted small">Drag the card, tap a button, or use the ← → keys.</p>
    </div>
  );
}
