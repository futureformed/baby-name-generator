import type { BabyName } from '../data/names';
import { GENDER_LABEL, countSyllables } from '../utils/generator';
import { sfx, speak } from '../lib/sound';
import { Heart } from './Art';

interface NameCardProps {
  name: BabyName;
  index: number;
  saved: boolean;
  surname: string;
  onToggleSave: (name: string) => void;
}

const TINTS = ['mint', 'peach', 'lavender', 'butter', 'sky'];

export function NameCard({ name, index, saved, surname, onToggleSave }: NameCardProps) {
  const syllables = countSyllables(name.name);

  return (
    <article className={`name-card tint-${TINTS[index % TINTS.length]}`} style={{ animationDelay: `${index * 60}ms` }}>
      <div className="name-card-top">
        <span className={`tag tag-${name.gender}`}>{GENDER_LABEL[name.gender]}</span>
        <div className="card-actions">
          <button
            className="icon-btn"
            onClick={() => speak(surname ? `${name.name} ${surname}` : name.name)}
            aria-label={`Hear ${name.name}`}
            title="Hear it"
          >
            🔊
          </button>
          <button
            className={`icon-btn heart-btn ${saved ? 'on' : ''}`}
            onClick={() => {
              sfx.squeak();
              onToggleSave(name.name);
            }}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${name.name} from shortlist` : `Save ${name.name} to shortlist`}
            title={saved ? 'Saved' : 'Save'}
          >
            <Heart size={22} color={saved ? '#ff7a95' : '#ffffff'} />
          </button>
        </div>
      </div>
      <h3 className="name-title">{name.name}</h3>
      {surname && <p className="full-preview">{name.name} {surname}</p>}
      <p className="meaning">“{name.meaning}”</p>
      <div className="meta">
        <span>🌍 {name.origin}</span>
        <span>✨ {name.popularity}</span>
        <span>🎵 {syllables} {syllables === 1 ? 'syllable' : 'syllables'}</span>
      </div>
    </article>
  );
}
