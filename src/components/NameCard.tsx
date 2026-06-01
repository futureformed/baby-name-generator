import type { BabyName } from '../data/names';

interface NameCardProps {
  name: BabyName;
}

export function NameCard({ name }: NameCardProps) {
  const genderEmoji = name.gender === 'boy' ? '👦' : name.gender === 'girl' ? '👧' : '👶';

  return (
    <div className="name-card">
      <div className="name-header">
        <h2>{name.name}</h2>
        <span className="gender-badge">{genderEmoji}</span>
      </div>
      <div className="name-details">
        <p className="meaning">{name.meaning}</p>
        <div className="meta">
          <span className="origin">{name.origin}</span>
          <span className="popularity">{name.popularity}</span>
        </div>
      </div>
    </div>
  );
}
