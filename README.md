# Baby Name Generator

A beautiful, easy-to-use web app that helps prospective parents discover the perfect name for their little one.

## Features

- **120+ curated names** with meanings, origins, and style tags
- **Smart filters** — filter by gender, style (classic, modern, trending, unique), origin, and starting letter
- **Randomized suggestions** — get fresh ideas every time you generate
- **Responsive design** — works beautifully on desktop and mobile
- **Dark mode** — automatic dark mode based on system preferences

## Tech Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/machomanrandysavageldn/baby-name-generator.git
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
