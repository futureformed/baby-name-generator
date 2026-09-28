# Little Names · Baby Name Generator

A playful, gender-neutral web app that helps parents-to-be find a name, agree on it, and reveal it at the baby shower.

## Features

- **221 curated names** with meanings, origins, style tags and syllable counts
- **Find names**: filter by gender (or neutral only), style, origin, syllables and first letter, then shake the rattle for fresh ideas
- **Hear it**: every name can be read aloud, with your surname
- **Shortlist**: save favourites, rank them, add a middle name, and check the full name (initials, rhythm, sound clashes)
- **Partner match**: each parent swipes the same names in private; you see only the names you both love
- **Baby shower reveal party**: the host locks the secret, guests join Team Girl or Team Boy and guess the name, then everyone counts down to a scratch card, balloon pump, surprise box, hatching egg or confetti cannon reveal. The name drops in letter by letter and the app scores the guesses
- **TV reveal link**: copy a link that opens the party on another screen
- **Generated sounds**: chimes, rattles, pops and fanfares made with the Web Audio API (mute button in the top bar)
- **Hand-drawn SVG art**, confetti, and a night-nursery dark mode
- **Private**: all lists stay in the browser's local storage

## Tech Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- No runtime dependencies beyond React: sounds, confetti and illustrations are all hand-written

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/futureformed/baby-name-generator.git
cd baby-name-generator
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Preview

```bash
npm run preview
```

## Contributing

Contributions are welcome! Here are some ways you can help:

- **Add more names** — expand the name database in `src/data/names.ts`
- **Improve the UI** — suggest or implement design improvements
- **Report bugs** — open an issue if you find something broken
- **Suggest features** — have an idea? Open a feature request

### Adding Names

Names are stored in `src/data/names.ts`. Each name follows this structure:

```typescript
{
  name: 'Example',
  gender: 'boy' | 'girl' | 'unisex',
  origin: 'English',
  meaning: 'A short description of the meaning',
  popularity: 'classic' | 'modern' | 'trending' | 'unique'
}
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
