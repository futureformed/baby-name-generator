import { useState } from 'react';
import { Teddy } from '../components/Art';
import { GENDER_LABEL, checkFlow, findName } from '../utils/generator';
import { useStored } from '../lib/storage';
import { sfx, speak } from '../lib/sound';

interface ShortlistProps {
  saved: string[];
  setSaved: (names: string[]) => void;
  surname: string;
  onSurnameChange: (s: string) => void;
  onUseInShower: (name: string) => void;
  goTo: (route: string) => void;
}

export function Shortlist({ saved, setSaved, surname, onSurnameChange, onUseInShower, goTo }: ShortlistProps) {
  const [middles, setMiddles] = useStored<Record<string, string>>('bng-middles', {});
  const [copied, setCopied] = useState(false);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= saved.length) return;
    sfx.tap();
    const next = [...saved];
    [next[i], next[j]] = [next[j], next[i]];
    setSaved(next);
  };

  const fullName = (first: string) => [first, middles[first], surname].map((s) => s?.trim()).filter(Boolean).join(' ');

  const copyList = async () => {
    const text = saved.map((n, i) => `${i + 1}. ${fullName(n)}`).join('\n');
    try {
      await navigator.clipboard.writeText(`Our baby name shortlist 🍼\n\n${text}`);
      sfx.yes();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  if (saved.length === 0) {
    return (
      <div className="screen center-screen">
        <Teddy size={140} className="bob" />
        <h1>Your shortlist is empty</h1>
        <p className="lead">Tap the heart on any name to save it here.</p>
        <button className="big-btn" onClick={() => goTo('find')}>Find names</button>
      </div>
    );
  }

  return (
    <div className="screen">
      <section className="page-head">
        <div>
          <h1>Our shortlist <span className="count-bubble">{saved.length}</span></h1>
          <p className="lead">Put your favourite at the top. Add a middle name and surname to test the full name.</p>
        </div>
        <div className="head-actions">
          <input
            className="soft-input"
            value={surname}
            onChange={(e) => onSurnameChange(e.target.value)}
            placeholder="Surname"
            aria-label="Surname"
            maxLength={40}
          />
          <button className="soft-btn" onClick={copyList}>{copied ? '✅ Copied' : '📋 Copy list'}</button>
        </div>
      </section>

      <ol className="shortlist">
        {saved.map((first, i) => {
          const info = findName(first);
          const flow = checkFlow(first, middles[first] ?? '', surname);
          return (
            <li key={first} className={`short-item ${i === 0 ? 'top-pick' : ''}`}>
              <div className="rank">{i === 0 ? '👑' : i + 1}</div>
              <div className="short-main">
                <div className="short-title">
                  <h3>{first}</h3>
                  {info && <span className={`tag tag-${info.gender}`}>{GENDER_LABEL[info.gender]}</span>}
                  {info && <span className="muted small">{info.origin} · “{info.meaning}”</span>}
                </div>
                <div className="full-name-line">
                  <span className="monogram" title="Initials">{flow.initials || '?'}</span>
                  <span className="full-name">{fullName(first)}</span>
                </div>
                <input
                  className="soft-input thin"
                  placeholder="Add a middle name"
                  aria-label={`Middle name for ${first}`}
                  value={middles[first] ?? ''}
                  onChange={(e) => setMiddles({ ...middles, [first]: e.target.value })}
                  maxLength={40}
                />
                {flow.notes.length > 0 && (
                  <ul className="flow-notes">
                    {flow.notes.map((n) => (
                      <li key={n.text} className={n.tone}>{n.tone === 'good' ? '✔︎' : '⚠︎'} {n.text}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="short-actions">
                <button className="icon-btn" onClick={() => speak(fullName(first))} aria-label={`Hear ${fullName(first)}`} title="Hear it">🔊</button>
                <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" title="Move up">⬆︎</button>
                <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === saved.length - 1} aria-label="Move down" title="Move down">⬇︎</button>
                <button className="icon-btn" onClick={() => { sfx.tap(); onUseInShower(fullName(first)); }} aria-label="Use in the shower reveal" title="Use in the shower reveal">🎉</button>
                <button className="icon-btn" onClick={() => { sfx.boing(); setSaved(saved.filter((n) => n !== first)); }} aria-label={`Remove ${first}`} title="Remove">✖︎</button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
