import { cellFromMouse, getCellSize, getGridOffset } from './renderer.js';
import { snapToDirection, getCellsAlongDirection } from '../game/directions.js';

/**
 * Get the mouse/touch position relative to the canvas element.
 */
/**
 * Get the mouse/touch position in CSS-pixel space relative to the canvas.
 * We use CSS-pixel space because the canvas context has DPR scaling applied.
 */
export function getCanvasPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();

  let clientX, clientY;
  if (event.touches) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getCSSSize(canvas) {
  const dpr = window.devicePixelRatio || 1;
  return {
    width: canvas.width / dpr,
    height: canvas.height / dpr,
  };
}

/**
 * Compute the selection cells for a drag from startCell to currentCell,
 * snapped to the nearest valid direction.
 */
export function computeSelectionCells(startCell, currentCell, grid) {
  if (!startCell || !currentCell) return [];

  const snap = snapToDirection(
    startCell.row,
    startCell.col,
    currentCell.row,
    currentCell.col,
  );

  if (!snap) return [{ ...startCell, letter: grid[startCell.row]?.[startCell.col] }];

  const { dirR, dirC, length } = snap;
  const cells = getCellsAlongDirection(
    startCell.row,
    startCell.col,
    dirR,
    dirC,
    length,
  );

  // Filter to valid grid positions and attach letters
  const gridSize = grid.length;
  return cells
    .filter((c) => c.row >= 0 && c.row < gridSize && c.col >= 0 && c.col < gridSize)
    .map((c) => ({ ...c, letter: grid[c.row][c.col] }));
}

/**
 * Create event handlers for canvas mouse/touch interaction.
 */
export function createInteractionHandlers(canvas, gridSize, grid, callbacks) {
  const { onSelectionChange, onSelectionEnd } = callbacks;

  let startCell = null;
  let isDragging = false;

  function getCell(event) {
    const pos = getCanvasPosition(canvas, event);
    const { width, height } = getCSSSize(canvas);
    const cellSize = getCellSize(width, height, gridSize);
    const offset = getGridOffset(width, height, cellSize, gridSize);
    return cellFromMouse(pos.x, pos.y, offset, cellSize, gridSize);
  }

  function handleStart(event) {
    event.preventDefault();
    const cell = getCell(event);
    if (!cell) return;

    startCell = cell;
    isDragging = true;
    onSelectionChange([{ ...cell, letter: grid[cell.row][cell.col] }]);
  }

  function handleMove(event) {
    event.preventDefault();
    if (!isDragging || !startCell) return;

    const cell = getCell(event);
    if (!cell) return;

    const cells = computeSelectionCells(startCell, cell, grid);
    onSelectionChange(cells);
  }

  function handleEnd(event) {
    event.preventDefault();
    if (!isDragging || !startCell) return;

    // Get final cell from the last known position
    let finalCell;
    if (event.changedTouches) {
      const rect = canvas.getBoundingClientRect();
      const x = event.changedTouches[0].clientX - rect.left;
      const y = event.changedTouches[0].clientY - rect.top;
      const { width, height } = getCSSSize(canvas);
      const cellSize = getCellSize(width, height, gridSize);
      const offset = getGridOffset(width, height, cellSize, gridSize);
      finalCell = cellFromMouse(x, y, offset, cellSize, gridSize);
    } else {
      finalCell = getCell(event);
    }

    const cells = finalCell
      ? computeSelectionCells(startCell, finalCell, grid)
      : [];

    isDragging = false;
    startCell = null;
    onSelectionEnd(cells);
  }

  // Attach listeners
  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mouseleave', handleEnd);
  canvas.addEventListener('touchstart', handleStart, { passive: false });
  canvas.addEventListener('touchmove', handleMove, { passive: false });
  canvas.addEventListener('touchend', handleEnd, { passive: false });

  // Return cleanup function
  return () => {
    canvas.removeEventListener('mousedown', handleStart);
    canvas.removeEventListener('mousemove', handleMove);
    canvas.removeEventListener('mouseup', handleEnd);
    canvas.removeEventListener('mouseleave', handleEnd);
    canvas.removeEventListener('touchstart', handleStart);
    canvas.removeEventListener('touchmove', handleMove);
    canvas.removeEventListener('touchend', handleEnd);
  };
}
