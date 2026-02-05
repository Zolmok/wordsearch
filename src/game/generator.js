import { getDirectionsForDifficulty, getWordCountForDifficulty } from './directions.js';
import { getWordsForCategory } from '../data/wordLists.js';

const GRID_SIZE = 15;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function canPlaceWord(grid, word, row, col, dir) {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir.dr * i;
    const c = col + dir.dc * i;

    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;

    const existing = grid[r][c];
    if (existing !== null && existing !== word[i]) return false;
  }
  return true;
}

function placeWord(grid, word, row, col, dir) {
  const cells = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dir.dr * i;
    const c = col + dir.dc * i;
    grid[r][c] = word[i];
    cells.push({ row: r, col: c });
  }
  return cells;
}

function fillEmptyCells(grid) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }
}

/**
 * Generate a word search puzzle.
 * Returns { grid, words, gridSize } where words includes placement info.
 */
export function generatePuzzle(category, difficulty) {
  const wordCount = getWordCountForDifficulty(difficulty);
  const directions = getDirectionsForDifficulty(difficulty);
  const wordList = getWordsForCategory(category, wordCount);
  const grid = createEmptyGrid(GRID_SIZE);
  const placedWords = [];

  for (const word of wordList) {
    let placed = false;
    const maxAttempts = 200;

    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlaceWord(grid, word, row, col, dir)) {
        const cells = placeWord(grid, word, row, col, dir);
        placedWords.push({
          word,
          row,
          col,
          direction: dir,
          cells,
        });
        placed = true;
      }
    }
    // If word couldn't be placed after max attempts, skip it
  }

  fillEmptyCells(grid);

  return {
    grid,
    words: placedWords,
    gridSize: GRID_SIZE,
  };
}
