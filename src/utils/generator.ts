import { babyNames } from '../data/names';
import type { BabyName } from '../data/names';

export interface FilterOptions {
  gender: 'all' | 'boy' | 'girl' | 'unisex';
  popularity: 'all' | 'classic' | 'modern' | 'trending' | 'unique';
  origin: string;
  startsWith: string;
  count: number;
}

export function getOrigins(): string[] {
  const origins = new Set(babyNames.map(n => n.origin));
  return Array.from(origins).sort();
}

export function generateNames(options: FilterOptions): BabyName[] {
  let filtered = [...babyNames];

  if (options.gender !== 'all') {
    filtered = filtered.filter(n => n.gender === options.gender || n.gender === 'unisex');
  }

  if (options.popularity !== 'all') {
    filtered = filtered.filter(n => n.popularity === options.popularity);
  }

  if (options.origin) {
    filtered = filtered.filter(n => n.origin === options.origin);
  }

  if (options.startsWith) {
    filtered = filtered.filter(n => n.name.toLowerCase().startsWith(options.startsWith.toLowerCase()));
  }

  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, options.count);
}
