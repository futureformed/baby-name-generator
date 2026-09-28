import { useEffect, useMemo, useState } from 'react';
import { Balloon, Onesie, Star } from '../components/Art';
import { RevealStage } from '../components/Reveals';
import { METHODS } from '../lib/revealMethods';
import type { RevealMethod } from '../lib/revealMethods';
import { PALETTES, RAINBOW, emptyParty, encodeParty } from '../lib/party';
import type { Guess, Outcome, Party, PaletteId, Team } from '../lib/party';
import { useStored } from '../lib/storage';
import { sfx, speak } from '../lib/sound';
import { burstConfetti } from '../lib/confetti';

const TINTS = ['mint', 'peach', 'lavender', 'butter', 'sky'];

type Phase = 'lobby' | 'setup' | 'party' | 'countdown' | 'reveal' | 'result';

interface ShowerProps {
  presetName: string;
  clearPreset: () => void;
  shortlist: string[];
  sharedParty: Party | null;
  clearShared: () => void;
}

export function Shower({ presetName, clearPreset, shortlist, sharedParty, clearShared }: ShowerProps) {
  const [party, setParty] = useStored<Party | null>('bng-party', null);
  const [guesses, setGuesses] = useStored<Guess[]>('bng-guesses', []);
  const [phase, setPhase] = useState<Phase>(sharedParty ? 'party' : party ? 'party' : 'lobby');
  const [draft, setDraft] = useState<Party>(() => ({ ...emptyParty, name: presetName }));
  const [method, setMethod] = useState<RevealMethod>('scratch');

  useEffect(() => {
    if (sharedParty) {
      setParty(sharedParty);
      setGuesses([]);
      setPhase('party');
      clearShared();
    }
  }, [sharedParty, setParty, setGuesses, clearShared]);

  useEffect(() => {
    if (presetName) {
      setDraft((d) => ({ ...d, name: presetName }));
      setPhase('setup');
      clearPreset();
    }
  }, [presetName, clearPreset]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [phase]);

  const palette = PALETTES[party?.palette ?? draft.palette];

  if (phase === 'lobby' || (!party && phase !== 'setup')) {
    return (
      <div className="screen">
        <section className="hero">
          <div className="hero-balloons">
            <Balloon size={60} color={PALETTES.classic.girl} className="float f1" />
            <Balloon size={70} color="#ffd95a" className="float f2" />
            <Balloon size={60} color={PALETTES.classic.boy} className="float f3" />
          </div>
          <div>
            <h1>Baby shower <span className="squiggle">reveal party</span></h1>
            <p className="lead">
              Guests pick a team and guess the name. Then everyone counts down, and you reveal the baby's sex and
              name with a scratch card, a balloon, a gift box, a hatching egg or a confetti cannon.
            </p>
          </div>
        </section>
        <div className="steps">
          {[
            ['🤫', 'Set the secret', 'The host enters the answer in private. It stays hidden from guests.'],
            ['🗳️', 'Guests guess', 'Everyone joins Team Girl or Team Boy and guesses the name.'],
            ['🥁', 'The big reveal', 'Countdown, drum roll, then pop, scratch, shake or hatch.'],
            ['🏆', 'Winners', 'See who guessed the team, the first letter and the full name.'],
          ].map(([icon, title, text], i) => (
            <div key={title} className="step card" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="step-icon">{icon}</div>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </div>
          ))}
        </div>
        <div className="generate-wrap">
          <button className="big-btn" onClick={() => { sfx.chime(); setPhase('setup'); }}>Host a reveal party</button>
        </div>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <SetupForm
        draft={draft}
        setDraft={setDraft}
        shortlist={shortlist}
        onCancel={() => setPhase(party ? 'party' : 'lobby')}
        onLock={() => {
          sfx.yes();
          setParty(draft);
          setGuesses([]);
          setPhase('party');
        }}
      />
    );
  }

  const p = party!;

  if (phase === 'party') {
    return (
      <PartyBoard
        party={p}
        guesses={guesses}
        setGuesses={setGuesses}
        palette={palette}
        onReveal={() => {
          const m = p.method === 'random' ? METHODS[Math.floor(Math.random() * METHODS.length)].id : p.method;
          setMethod(m);
          setPhase('countdown');
        }}
        onNewParty={() => {
          setDraft({ ...emptyParty });
          setPhase('setup');
        }}
      />
    );
  }

  const color = p.outcome === 'surprise' ? '#ffd95a' : palette[p.outcome];
  const confetti = p.outcome === 'surprise' ? RAINBOW : [color, '#ffffff', '#ffd95a', color];
  const label = p.outcome === 'surprise' ? 'Hello!' : p.outcome === 'girl' ? "It's a girl!" : "It's a boy!";

  if (phase === 'countdown') {
    return <Countdown onDone={() => setPhase('reveal')} />;
  }

  if (phase === 'reveal') {
    const info = METHODS.find((m) => m.id === method)!;
    return (
      <div className="screen center-screen reveal-screen">
        <h1>{info.icon} {info.label}</h1>
        <p className="lead">{info.blurb}</p>
        <RevealStage method={method} color={color} confetti={confetti} label={label} onDone={() => setPhase('result')} />
      </div>
    );
  }

  return (
    <RevealResult
      party={p}
      color={color}
      confetti={confetti}
      label={label}
      guesses={guesses}
      onBack={() => setPhase('party')}
    />
  );
}

function SetupForm({ draft, setDraft, shortlist, onCancel, onLock }: {
  draft: Party;
  setDraft: (p: Party) => void;
  shortlist: string[];
  onCancel: () => void;
  onLock: () => void;
}) {
  const set = <K extends keyof Party>(k: K, v: Party[K]) => {
    sfx.tap();
    setDraft({ ...draft, [k]: v });
  };
  const pal = PALETTES[draft.palette];

  return (
    <div className="screen">
      <section className="secret-banner">
        <span className="secret-icon">🤫</span>
        <div>
          <h1>Host only: set the secret</h1>
          <p>Guests must not see this screen. After you lock it, the answer is hidden.</p>
        </div>
      </section>

      <section className="card setup-card">
        <div className="filter-row">
          <span className="filter-label">The baby is a…</span>
          <div className="outcome-row">
            {(['girl', 'boy', 'surprise'] as Outcome[]).map((o) => (
              <button
                key={o}
                className={`outcome ${draft.outcome === o ? 'on' : ''}`}
                style={{ background: o === 'surprise' ? `linear-gradient(135deg, ${RAINBOW.join(',')})` : pal[o] }}
                onClick={() => set('outcome', o)}
                aria-pressed={draft.outcome === o}
              >
                <Onesie size={56} color="#fffaf0" />
                <span>{o === 'girl' ? 'Girl' : o === 'boy' ? 'Boy' : 'Name only'}</span>
              </button>
            ))}
          </div>
          {draft.outcome === 'surprise' && <p className="muted small">Keep the sex a surprise and reveal only the name.</p>}
        </div>

        <div className="two-col">
          <label className="filter-row">
            <span className="filter-label">Baby's name (optional)</span>
            <input
              className="soft-input"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Leave blank to reveal only the sex"
              maxLength={60}
              list="shortlist-names"
              autoComplete="off"
            />
            <datalist id="shortlist-names">
              {shortlist.map((n) => <option key={n} value={n} />)}
            </datalist>
          </label>
          <label className="filter-row">
            <span className="filter-label">Parents' names (optional)</span>
            <input
              className="soft-input"
              value={draft.parents}
              onChange={(e) => setDraft({ ...draft, parents: e.target.value })}
              placeholder="e.g. Sam & Alex"
              maxLength={60}
            />
          </label>
        </div>

        <div className="filter-row">
          <span className="filter-label">Team colours</span>
          <div className="chips">
            {(Object.keys(PALETTES) as PaletteId[]).map((id) => (
              <button key={id} className={`chip ${draft.palette === id ? 'on' : ''}`} onClick={() => set('palette', id)}>
                <span className="swatch" style={{ background: PALETTES[id].girl }} />
                <span className="swatch" style={{ background: PALETTES[id].boy }} />
                {PALETTES[id].label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">How to reveal</span>
          <div className="method-grid">
            {[{ id: 'random' as const, label: 'Surprise me', icon: '🎲', blurb: 'Pick one at random on the day.' }, ...METHODS].map((m) => (
              <button key={m.id} className={`method ${draft.method === m.id ? 'on' : ''}`} onClick={() => set('method', m.id)}>
                <span className="method-icon">{m.icon}</span>
                <b>{m.label}</b>
                <small>{m.blurb}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button className="link-btn" onClick={onCancel}>Cancel</button>
          <button className="big-btn" onClick={onLock}>🔒 Lock the secret</button>
        </div>
      </section>
    </div>
  );
}

function PartyBoard({ party, guesses, setGuesses, palette, onReveal, onNewParty }: {
  party: Party;
  guesses: Guess[];
  setGuesses: (g: Guess[]) => void;
  palette: { girl: string; boy: string };
  onReveal: () => void;
  onNewParty: () => void;
}) {
  const [who, setWho] = useState('');
  const [team, setTeam] = useState<Team | null>(null);
  const [nameGuess, setNameGuess] = useState('');
  const [copied, setCopied] = useState(false);
  const girls = guesses.filter((g) => g.team === 'girl');
  const boys = guesses.filter((g) => g.team === 'boy');
  const total = guesses.length || 1;
  const girlPct = guesses.length ? (girls.length / total) * 100 : 50;
  const showTeams = party.outcome !== 'surprise';

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!who.trim() || (showTeams && !team)) return;
    sfx.pop();
    setGuesses([...guesses, { id: Date.now(), who: who.trim(), team: team ?? 'girl', nameGuess: nameGuess.trim() }]);
    setWho('');
    setNameGuess('');
    setTeam(null);
  };

  const shareLink = `${window.location.origin}${window.location.pathname}#reveal/${encodeParty(party)}`;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      sfx.yes();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="screen">
      <section className="page-head">
        <div>
          <h1>{party.parents ? `${party.parents}'s reveal party` : 'Reveal party'} 🎉</h1>
          <p className="lead">The secret is locked. Add each guest's guess, then start the reveal.</p>
        </div>
        <div className="head-actions">
          <button className="soft-btn" onClick={copyLink} title="Open this link on a TV or laptop to run the reveal there">
            {copied ? '✅ Link copied' : '📺 Copy reveal link'}
          </button>
          <button className="link-btn" onClick={onNewParty}>New party</button>
        </div>
      </section>

      {showTeams && (
        <section className="card tug">
          <div className="tug-labels">
            <span style={{ color: palette.girl }}>Team Girl · {girls.length}</span>
            <span style={{ color: palette.boy }}>{boys.length} · Team Boy</span>
          </div>
          <div className="tug-bar">
            <div style={{ width: `${girlPct}%`, background: palette.girl }} />
            <div style={{ width: `${100 - girlPct}%`, background: palette.boy }} />
            <span className="tug-knot" style={{ left: `${girlPct}%` }}>🧸</span>
          </div>
        </section>
      )}

      <div className="party-grid">
        <form className="card guess-form" onSubmit={add}>
          <h2>Add a guess</h2>
          <label className="filter-row">
            <span className="filter-label">Guest name</span>
            <input className="soft-input" value={who} onChange={(e) => setWho(e.target.value)} placeholder="e.g. Auntie Jo" maxLength={30} />
          </label>
          {showTeams && (
            <div className="filter-row">
              <span className="filter-label">Team</span>
              <div className="team-pick">
                {(['girl', 'boy'] as Team[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`team-btn ${team === t ? 'on' : ''}`}
                    style={{ '--team': palette[t] } as React.CSSProperties}
                    onClick={() => { sfx.tap(); setTeam(t); }}
                  >
                    Team {t === 'girl' ? 'Girl' : 'Boy'}
                  </button>
                ))}
              </div>
            </div>
          )}
          {party.name && (
            <label className="filter-row">
              <span className="filter-label">Name guess</span>
              <input className="soft-input" value={nameGuess} onChange={(e) => setNameGuess(e.target.value)} placeholder="What will the baby be called?" maxLength={40} />
            </label>
          )}
          <button className="big-btn small-big" type="submit" disabled={!who.trim() || (showTeams && !team)}>Add guess</button>
        </form>

        <section className="card guess-list">
          <h2>Guesses <span className="count-bubble">{guesses.length}</span></h2>
          {guesses.length === 0 ? (
            <p className="muted">No guesses yet. Pass the phone around!</p>
          ) : (
            <ul>
              {guesses.map((g) => (
                <li key={g.id} className="guess-chip" style={{ borderColor: showTeams ? palette[g.team] : undefined }}>
                  {showTeams && <span className="dot" style={{ background: palette[g.team] }} />}
                  <b>{g.who}</b>
                  {g.nameGuess && <span className="muted">“{g.nameGuess}”</span>}
                  <button className="x-btn" onClick={() => setGuesses(guesses.filter((x) => x.id !== g.id))} aria-label={`Remove ${g.who}`}>✖︎</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="generate-wrap">
        <button className="big-btn reveal-btn" onClick={() => { sfx.chime(); onReveal(); }}>
          🥁 Start the reveal
        </button>
      </div>
    </div>
  );
}

function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);

  useEffect(() => {
    sfx.drumroll(3.2);
    const t = window.setInterval(() => {
      setN((x) => {
        if (x <= 1) {
          window.clearInterval(t);
          window.setTimeout(onDone, 500);
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [onDone]);

  return (
    <div className="countdown">
      <div key={n} className="count-num">{n || '🎉'}</div>
      <p>Everybody count down!</p>
    </div>
  );
}

function RevealResult({ party, color, confetti, label, guesses, onBack }: {
  party: Party;
  color: string;
  confetti: string[];
  label: string;
  guesses: Guess[];
  onBack: () => void;
}) {
  const letters = useMemo(() => party.name.trim().split(''), [party.name]);
  // Group letters by word so a name never wraps mid-word.
  const words = useMemo(() => {
    const out: { chars: { ch: string; i: number }[] }[] = [{ chars: [] }];
    letters.forEach((ch, i) => (ch === ' ' ? out.push({ chars: [] }) : out[out.length - 1].chars.push({ ch, i })));
    return out.filter((w) => w.chars.length);
  }, [letters]);
  const [shown, setShown] = useState(0);
  const [stage, setStage] = useState<'label' | 'name' | 'done'>('label');

  useEffect(() => {
    const t = window.setTimeout(() => setStage(letters.length ? 'name' : 'done'), 1800);
    return () => window.clearTimeout(t);
  }, [letters.length]);

  useEffect(() => {
    if (stage !== 'name') return;
    if (shown >= letters.length) {
      sfx.fanfare();
      burstConfetti(confetti, 220);
      speak(party.outcome === 'surprise' ? `Say hello to ${party.name}` : `${label.replace('!', '')}. Say hello to ${party.name}`);
      const t = window.setTimeout(() => setStage('done'), 800);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      sfx.tap();
      setShown((s) => s + 1);
    }, letters[shown] === ' ' ? 120 : 380);
    return () => window.clearTimeout(t);
  }, [stage, shown, letters, confetti, party, label]);

  const target = party.name.trim().toLowerCase();
  const scored = guesses
    .map((g) => {
      let points = 0;
      const reasons: string[] = [];
      if (party.outcome !== 'surprise' && g.team === party.outcome) {
        points += 1;
        reasons.push('team');
      }
      const guess = g.nameGuess.toLowerCase();
      if (target && guess) {
        if (guess === target || guess === target.split(' ')[0]) {
          points += 3;
          reasons.push('name');
        } else if (guess[0] === target[0]) {
          points += 1;
          reasons.push('first letter');
        }
      }
      return { ...g, points, reasons };
    })
    .sort((a, b) => b.points - a.points);
  const best = scored[0]?.points ?? 0;
  const bg = party.outcome === 'surprise' ? `linear-gradient(135deg, ${RAINBOW.join(',')})` : color;

  return (
    <div className="result-screen" style={{ background: bg }}>
      <div className="result-stars" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <Star key={i} size={18 + (i % 4) * 8} color="#fffaf0" className="twinkle" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%`, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <h1 className="result-label">{label}</h1>
      {letters.length > 0 && stage !== 'label' && (
        <div className="result-name" aria-label={party.name}>
          {words.map((word, w) => (
            <span key={w} className="result-word">
              {word.chars.map(({ ch, i }) =>
                i < shown ? (
                  <span key={i} className={`drop-block tint-${TINTS[i % TINTS.length]}`}>{ch}</span>
                ) : null,
              )}
            </span>
          ))}
        </div>
      )}
      {stage === 'done' && (
        <div className="result-bottom">
          {letters.length > 0 && (
            <button className="soft-btn" onClick={() => speak(party.name)}>🔊 Say it again</button>
          )}
          {scored.length > 0 && (
            <div className="card winners">
              <h2>🏆 Who guessed right?</h2>
              <ol>
                {scored.slice(0, 8).map((g) => (
                  <li key={g.id} className={g.points === best && best > 0 ? 'winner' : ''}>
                    <b>{g.who}</b>
                    <span className="muted small">{g.reasons.length ? g.reasons.join(' + ') : 'better luck next time'}</span>
                    <span className="pts">{g.points} pts</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <button className="link-btn light" onClick={onBack}>Back to the party</button>
        </div>
      )}
    </div>
  );
}
