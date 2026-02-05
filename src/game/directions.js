export const DIRECTIONS = {
  RIGHT: { dr: 0, dc: 1, label: 'right' },
  LEFT: { dr: 0, dc: -1, label: 'left' },
  DOWN: { dr: 1, dc: 0, label: 'down' },
  UP: { dr: -1, dc: 0, label: 'up' },
  DOWN_RIGHT: { dr: 1, dc: 1, label: 'down-right' },
  DOWN_LEFT: { dr: 1, dc: -1, label: 'down-left' },
  UP_RIGHT: { dr: -1, dc: 1, label: 'up-right' },
  UP_LEFT: { dr: -1, dc: -1, label: 'up-left' },
};

const EASY_DIRECTIONS = [
  DIRECTIONS.RIGHT,
  DIRECTIONS.LEFT,
  DIRECTIONS.DOWN,
  DIRECTIONS.UP,
];

const MEDIUM_DIRECTIONS = [
  ...EASY_DIRECTIONS,
  DIRECTIONS.DOWN_RIGHT,
  DIRECTIONS.DOWN_LEFT,
];

const HARD_DIRECTIONS = Object.values(DIRECTIONS);

export function getDirectionsForDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy':
      return EASY_DIRECTIONS;
    case 'medium':
      return MEDIUM_DIRECTIONS;
    case 'hard':
      return HARD_DIRECTIONS;
    default:
      return MEDIUM_DIRECTIONS;
  }
}

export function getWordCountForDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 8;
    case 'medium':
      return 12;
    case 'hard':
      return 16;
    default:
      return 12;
  }
}

/**
 * Snap a direction vector to the nearest valid cardinal/diagonal direction.
 * Given a start cell and current cell, returns the direction and cell count.
 */
export function snapToDirection(startRow, startCol, currentRow, currentCol) {
  const dr = currentRow - startRow;
  const dc = currentCol - startCol;

  if (dr === 0 && dc === 0) return null;

  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  let dirR, dirC, length;

  if (absDr === 0) {
    // Horizontal
    dirR = 0;
    dirC = dc > 0 ? 1 : -1;
    length = absDc;
  } else if (absDc === 0) {
    // Vertical
    dirR = dr > 0 ? 1 : -1;
    dirC = 0;
    length = absDr;
  } else if (absDr >= absDc * 2) {
    // Mostly vertical
    dirR = dr > 0 ? 1 : -1;
    dirC = 0;
    length = absDr;
  } else if (absDc >= absDr * 2) {
    // Mostly horizontal
    dirR = 0;
    dirC = dc > 0 ? 1 : -1;
    length = absDc;
  } else {
    // Diagonal
    dirR = dr > 0 ? 1 : -1;
    dirC = dc > 0 ? 1 : -1;
    length = Math.max(absDr, absDc);
  }

  return { dirR, dirC, length };
}

/**
 * Get all cells along a line from start in a given direction for `length` steps.
 */
export function getCellsAlongDirection(startRow, startCol, dirR, dirC, length) {
  const cells = [];
  for (let i = 0; i <= length; i++) {
    cells.push({ row: startRow + dirR * i, col: startCol + dirC * i });
  }
  return cells;
}
