import type { RevealMethod } from './revealMethods';

export type Outcome = 'girl' | 'boy' | 'surprise';
export type Team = 'girl' | 'boy';

export interface Party {
  outcome: Outcome;
  name: string;
  method: RevealMethod | 'random';
  palette: PaletteId;
  parents: string;
}

export interface Guess {
  id: number;
  who: string;
  team: Team;
  nameGuess: string;
}

export type PaletteId = 'classic' | 'garden' | 'sunset';
export const PALETTES: Record<PaletteId, { label: string; girl: string; boy: string }> = {
  classic: { label: 'Pink & blue', girl: '#ff8fab', boy: '#6ec3f4' },
  garden: { label: 'Lilac & mint', girl: '#b48ce0', boy: '#5fc9a0' },
  sunset: { label: 'Coral & teal', girl: '#ff9166', boy: '#3fb8c0' },
};
export const RAINBOW = ['#ff8fab', '#ffd95a', '#5fc9a0', '#6ec3f4', '#b48ce0'];

export const emptyParty: Party = { outcome: 'girl', name: '', method: 'random', palette: 'classic', parents: '' };

// Light obfuscation so the secret is not readable at a glance in the link.
export function encodeParty(p: Party): string {
  const json = JSON.stringify(p);
  return btoa(unescape(encodeURIComponent(json))).split('').reverse().join('').replace(/=/g, '');
}

export function decodeParty(code: string): Party | null {
  try {
    const b64 = code.split('').reverse().join('');
    const padded = b64 + '==='.slice((b64.length + 3) % 4);
    const p = JSON.parse(decodeURIComponent(escape(atob(padded)))) as Party;
    if (!['girl', 'boy', 'surprise'].includes(p.outcome)) return null;
    return { ...emptyParty, ...p };
  } catch {
    return null;
  }
}
