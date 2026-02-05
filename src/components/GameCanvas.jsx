import { useEffect, useRef, useMemo } from 'react';
import { useCanvas } from '../hooks/useCanvas.js';
import { drawGrid, getCellSize, getGridOffset } from '../canvas/renderer.js';
import { createInteractionHandlers } from '../canvas/interaction.js';
import { createAnimationManager } from '../canvas/animations.js';

export default function GameCanvas({
  grid,
  gridSize,
  foundWords,
  selectionCells,
  onSelectionChange,
  onSelectionEnd,
  hintCells,
}) {
  const { canvasRef, containerRef } = useCanvas();
  const animManagerRef = useRef(null);
  const animStateRef = useRef({ flashCells: [], flashAlpha: 0, hintCells: [] });
  // Store latest callbacks in refs to avoid re-registering interaction handlers
  const callbacksRef = useRef({ onSelectionChange, onSelectionEnd });
  callbacksRef.current = { onSelectionChange, onSelectionEnd };

  // Store latest render state in ref so draw() always uses current values
  const renderStateRef = useRef({
    foundWords,
    selectionCells,
    hintCells,
  });
  renderStateRef.current = { foundWords, selectionCells, hintCells };

  // Stable found word index
  const foundWordIndex = useMemo(() => {
    const idx = {};
    foundWords.forEach((w, i) => {
      idx[w.word] = i;
    });
    return idx;
  }, [foundWords]);
  const foundWordIndexRef = useRef(foundWordIndex);
  foundWordIndexRef.current = foundWordIndex;

  // Stable draw function that reads from refs
  const drawRef = useRef(null);
  drawRef.current = () => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;
    const cellSize = getCellSize(cssWidth, cssHeight, gridSize);
    const offset = getGridOffset(cssWidth, cssHeight, cellSize, gridSize);

    const anim = animStateRef.current;
    const rs = renderStateRef.current;

    drawGrid(ctx, grid, cellSize, offset, {
      foundWords: rs.foundWords,
      foundWordIndex: foundWordIndexRef.current,
      selectionCells: rs.selectionCells,
      hintCells: anim.hintCells.length > 0 ? anim.hintCells : (rs.hintCells || []),
      flashCells: anim.flashCells,
      flashAlpha: anim.flashAlpha,
    });
  };

  // Set up animation manager once
  useEffect(() => {
    const manager = createAnimationManager();
    animManagerRef.current = manager;

    manager.setFrameCallback((state) => {
      animStateRef.current = state;
      drawRef.current?.();
    });

    return () => manager.destroy();
  }, []);

  // Redraw when props change
  useEffect(() => {
    drawRef.current?.();
  }, [grid, gridSize, foundWords, selectionCells, hintCells]);

  // Also redraw on resize
  useEffect(() => {
    function handleResize() {
      drawRef.current?.();
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up interaction handlers (only re-register when grid changes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;

    const cleanup = createInteractionHandlers(canvas, gridSize, grid, {
      onSelectionChange: (cells) => callbacksRef.current.onSelectionChange(cells),
      onSelectionEnd: (cells) => {
        const match = callbacksRef.current.onSelectionEnd(cells);
        if (match) {
          animManagerRef.current?.triggerFlash(match.cells);
        }
      },
    });

    return cleanup;
  }, [grid, gridSize, canvasRef]);

  // Trigger hint animation when hintCells change
  useEffect(() => {
    if (hintCells && hintCells.length > 0) {
      animManagerRef.current?.triggerHint(hintCells);
    }
  }, [hintCells]);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-square max-h-[calc(100vh-180px)]"
    >
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair touch-none"
      />
    </div>
  );
}
