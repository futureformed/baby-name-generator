import { babyNames } from '../data/names';
import type { BabyName } from '../data/names';

export type GenderFilter = 'all' | 'boy' | 'girl' | 'unisex';
export type StyleFilter = 'all' | BabyName['popularity'];
export type SyllableFilter = 0 | 1 | 2 | 3;

export interface FilterOptions {
  gender: GenderFilter;
  popularity: StyleFilter;
  origin: string;
  startsWith: string;
  syllables: SyllableFilter; // 0 = any, 3 = three or more
  count: number;
}

export const defaultFilters: FilterOptions = {
  gender: 'all',
  popularity: 'all',
  origin: '',
  startsWith: '',
  syllables: 0,
  count: 8,
};

export const GENDER_LABEL: Record<BabyName['gender'], string> = { boy: 'Boy', girl: 'Girl', unisex: 'Any' };

export function getOrigins(): string[] {
  return Array.from(new Set(babyNames.map((n) => n.origin))).sort();
}

// Names the rules below get wrong.
const SYLLABLE_OVERRIDES: Record<string, number> = { esme: 2, penelope: 4, phoebe: 2, mateo: 3, elodie: 3, ines: 2, renee: 2 };

/** Rough English syllable count. Good enough for filtering names. */
export function countSyllables(word: string): number {
  const override = SYLLABLE_OVERRIDES[word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')];
  if (override) return override;
  const w = word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
  const trimmed = w.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = trimmed.match(/[aeiouy]{1,2}/g)?.length ?? 0;
  // Vowel pairs that are said as two sounds in names: Mia, Leo, Noah, Chloe.
  const splits = trimmed.match(/ia|io|eo|ua|iu|oe$|oah|eah?$/g)?.length ?? 0;
  return Math.max(1, groups + splits);
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function filterNames(options: FilterOptions): BabyName[] {
  return babyNames.filter((n) => {
    if (options.gender === 'unisex' && n.gender !== 'unisex') return false;
    if ((options.gender === 'boy' || options.gender === 'girl') && n.gender !== options.gender && n.gender !== 'unisex') return false;
    if (options.popularity !== 'all' && n.popularity !== options.popularity) return false;
    if (options.origin && n.origin !== options.origin) return false;
    if (options.startsWith && !n.name.toLowerCase().startsWith(options.startsWith.toLowerCase())) return false;
    if (options.syllables) {
      const s = countSyllables(n.name);
      if (options.syllables === 3 ? s < 3 : s !== options.syllables) return false;
    }
    return true;
  });
}

export function generateNames(options: FilterOptions): BabyName[] {
  return shuffle(filterNames(options)).slice(0, options.count);
}

export function shuffledNames(): BabyName[] {
  return shuffle(babyNames);
}

export function findName(name: string): BabyName | undefined {
  return babyNames.find((n) => n.name === name);
}

// Initials that may cause playground teasing.
const AWKWARD = new Set([
  'ASS', 'BUM', 'PIG', 'FAT', 'DIE', 'RAT', 'BAD', 'SAD', 'MAD', 'POO', 'WEE', 'ZIT', 'COW', 'HAG',
  'SOB', 'BUG', 'FOE', 'GAS', 'SAG', 'SIN', 'SUX', 'LOL', 'OMG', 'WTF', 'ICK', 'EEK', 'NIT', 'DUD',
  'DUM', 'FUK', 'PMS', 'VD', 'KKK', 'BO', 'PU', 'UGH', 'APE', 'HOG', 'RIP', 'MUD', 'BOO', 'ODD',
]);

export interface FlowCheck {
  initials: string;
  notes: { tone: 'good' | 'warn'; text: string }[];
}

/** Practical checks parents ask about: initials, rhythm and sound clashes. */
export function checkFlow(first: string, middle: string, surname: string): FlowCheck {
  const parts = [first, middle, surname].map((p) => p.trim()).filter(Boolean);
  const initials = parts.map((p) => p[0].toUpperCase()).join('');
  const notes: FlowCheck['notes'] = [];
  const last = surname.trim();

  if (initials.length >= 2 && AWKWARD.has(initials)) {
    notes.push({ tone: 'warn', text: `Initials spell "${initials}". Other kids may notice.` });
  } else if (initials.length >= 2) {
    notes.push({ tone: 'good', text: `Initials "${initials}" look clear.` });
  }

  if (last) {
    const fs = countSyllables(first);
    const ls = countSyllables(last);
    if (fs === ls && fs === 1) {
      notes.push({ tone: 'warn', text: 'Two one-syllable names can sound short. A longer middle name helps.' });
    } else if (fs !== ls) {
      notes.push({ tone: 'good', text: `Nice rhythm: ${fs} + ${ls} syllables.` });
    } else {
      notes.push({ tone: 'good', text: `Even rhythm: ${fs} + ${ls} syllables.` });
    }

    const endVowel = /[aeiouy]$/i.test(first);
    const startVowel = /^[aeiou]/i.test(last);
    if (endVowel && startVowel) {
      notes.push({ tone: 'warn', text: `"${first} ${last}" may blur together when said fast.` });
    }
    if (first[0]?.toLowerCase() === last[0]?.toLowerCase()) {
      notes.push({ tone: 'good', text: 'Alliteration! Fun and easy to remember.' });
    }
    const tail = first.toLowerCase().slice(-2);
    if (tail.length === 2 && last.toLowerCase().endsWith(tail)) {
      notes.push({ tone: 'warn', text: 'The first name and surname end with the same sound.' });
    }
  }

  return { initials, notes };
}
