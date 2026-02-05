const BG_COLOR = '#0a0a1a';
const GRID_LINE_COLOR = 'rgba(0, 240, 255, 0.08)';
const LETTER_COLOR = '#ccccdd';
const LETTER_FONT_FAMILY = "'Courier New', Courier, monospace";

// Colors assigned to found words (cycle through them)
const FOUND_COLORS = [
  'rgba(0, 240, 255, 0.25)',   // cyan
  'rgba(255, 0, 170, 0.25)',   // magenta
  'rgba(0, 255, 136, 0.25)',   // neon green
  'rgba(255, 200, 0, 0.25)',   // gold
  'rgba(140, 80, 255, 0.25)',  // purple
  'rgba(255, 100, 50, 0.25)',  // orange
  'rgba(0, 180, 255, 0.25)',   // blue
  'rgba(255, 50, 100, 0.25)',  // red-pink
];

const FOUND_BORDER_COLORS = [
  'rgba(0, 240, 255, 0.6)',
  'rgba(255, 0, 170, 0.6)',
  'rgba(0, 255, 136, 0.6)',
  'rgba(255, 200, 0, 0.6)',
  'rgba(140, 80, 255, 0.6)',
  'rgba(255, 100, 50, 0.6)',
  'rgba(0, 180, 255, 0.6)',
  'rgba(255, 50, 100, 0.6)',
];

export function getCellSize(canvasWidth, canvasHeight, gridSize) {
  return Math.floor(Math.min(canvasWidth, canvasHeight) / gridSize);
}

export function getGridOffset(canvasWidth, canvasHeight, cellSize, gridSize) {
  const totalSize = cellSize * gridSize;
  return {
    x: Math.floor((canvasWidth - totalSize) / 2),
    y: Math.floor((canvasHeight - totalSize) / 2),
  };
}

export function cellFromMouse(mouseX, mouseY, offset, cellSize, gridSize) {
  const col = Math.floor((mouseX - offset.x) / cellSize);
  const row = Math.floor((mouseY - offset.y) / cellSize);

  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null;
  return { row, col };
}

export function drawGrid(ctx, grid, cellSize, offset, options = {}) {
  const {
    foundWords = [],
    foundWordIndex = {},
    selectionCells = [],
    hintCells = [],
    flashCells = [],
    flashAlpha = 0,
  } = options;

  const gridSize = grid.length;
  const totalSize = cellSize * gridSize;

  // Clear (use a large rect since ctx has DPR scaling)
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Note: overfills due to DPR transform, but canvas clips it - this is fine

  // Grid lines
  ctx.strokeStyle = GRID_LINE_COLOR;
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridSize; i++) {
    // Vertical
    ctx.beginPath();
    ctx.moveTo(offset.x + i * cellSize, offset.y);
    ctx.lineTo(offset.x + i * cellSize, offset.y + totalSize);
    ctx.stroke();
    // Horizontal
    ctx.beginPath();
    ctx.moveTo(offset.x, offset.y + i * cellSize);
    ctx.lineTo(offset.x + totalSize, offset.y + i * cellSize);
    ctx.stroke();
  }

  // Build sets for quick lookup
  const selectionSet = new Set(selectionCells.map((c) => `${c.row},${c.col}`));
  const hintSet = new Set(hintCells.map((c) => `${c.row},${c.col}`));
  const flashSet = new Set(flashCells.map((c) => `${c.row},${c.col}`));

  // Found word highlights - draw per-word capsule shapes
  for (const word of foundWords) {
    const idx = foundWordIndex[word.word] ?? 0;
    const colorIdx = idx % FOUND_COLORS.length;
    const cells = word.cells;
    if (cells.length === 0) continue;

    ctx.fillStyle = FOUND_COLORS[colorIdx];
    ctx.strokeStyle = FOUND_BORDER_COLORS[colorIdx];
    ctx.lineWidth = 2;

    // Draw a rounded path along the word cells
    const padding = cellSize * 0.1;
    const radius = cellSize * 0.3;

    if (cells.length === 1) {
      const cx = offset.x + cells[0].col * cellSize + padding;
      const cy = offset.y + cells[0].row * cellSize + padding;
      const size = cellSize - padding * 2;
      ctx.beginPath();
      ctx.roundRect(cx, cy, size, size, radius);
      ctx.fill();
      ctx.stroke();
    } else {
      // Draw a capsule from first to last cell
      const first = cells[0];
      const last = cells[cells.length - 1];
      const x1 = offset.x + first.col * cellSize + cellSize / 2;
      const y1 = offset.y + first.row * cellSize + cellSize / 2;
      const x2 = offset.x + last.col * cellSize + cellSize / 2;
      const y2 = offset.y + last.row * cellSize + cellSize / 2;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len;
      const ny = dx / len;
      const halfW = cellSize / 2 - padding;

      ctx.beginPath();
      ctx.moveTo(x1 + nx * halfW, y1 + ny * halfW);
      ctx.lineTo(x2 + nx * halfW, y2 + ny * halfW);
      ctx.arc(x2, y2, halfW, Math.atan2(ny, nx), Math.atan2(-ny, -nx), false);
      ctx.lineTo(x1 - nx * halfW, y1 - ny * halfW);
      ctx.arc(x1, y1, halfW, Math.atan2(-ny, -nx), Math.atan2(ny, nx), false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  // Selection highlight
  if (selectionCells.length > 0) {
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 2;
    for (const cell of selectionCells) {
      const cx = offset.x + cell.col * cellSize;
      const cy = offset.y + cell.row * cellSize;
      ctx.fillRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);
      ctx.strokeRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);
    }
  }

  // Flash animation on recently found cells
  if (flashCells.length > 0 && flashAlpha > 0) {
    ctx.fillStyle = `rgba(0, 255, 136, ${flashAlpha * 0.4})`;
    for (const cell of flashCells) {
      const cx = offset.x + cell.col * cellSize;
      const cy = offset.y + cell.row * cellSize;
      ctx.fillRect(cx, cy, cellSize, cellSize);
    }
  }

  // Letters
  const fontSize = Math.max(10, Math.floor(cellSize * 0.55));
  ctx.font = `bold ${fontSize}px ${LETTER_FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const key = `${r},${c}`;
      const cx = offset.x + c * cellSize + cellSize / 2;
      const cy = offset.y + r * cellSize + cellSize / 2;

      // Determine letter color
      if (selectionSet.has(key)) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
        ctx.shadowBlur = 12;
      } else if (hintSet.has(key)) {
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = 'rgba(0, 255, 136, 0.8)';
        ctx.shadowBlur = 15;
      } else if (flashSet.has(key) && flashAlpha > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = `rgba(0, 255, 136, ${flashAlpha})`;
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = LETTER_COLOR;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(grid[r][c], cx, cy);

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }
}
