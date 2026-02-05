# Wordsearch

A React-based word search puzzle game with multiple categories, difficulty levels, and a scoring system.

## Features

- **9 Categories**: Animals, Sports, Science, Food, Geography, Technology, Music, Movies, and Nature
- **3 Difficulty Levels**:
  - Easy: 6 words, horizontal/vertical only
  - Medium: 8 words, adds diagonal directions
  - Hard: 10 words, all directions including reverse
- **Canvas-based Grid**: Drag-to-select word highlighting with smooth rendering
- **Scoring System**: Points based on word length with time bonuses and difficulty multipliers
- **Hint System**: 3 hints per game to reveal unfound words
- **High Scores**: Persistent tracking via localStorage

## Tech Stack

- React 19
- Vite 7
- TailwindCSS 4
- TanStack Router & React Query

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/   # React components (Grid, WordList, Timer, etc.)
├── routes/       # Page routes (home, game, scores)
├── game/         # Game logic (generator, validator, scoring)
├── canvas/       # Canvas rendering and interaction
├── hooks/        # Custom React hooks
└── data/         # Word lists by category
```
