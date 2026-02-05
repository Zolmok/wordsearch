/**
 * Manages animation state for the canvas.
 * Flash effect when a word is found, hint pulse effect.
 */
export function createAnimationManager() {
  let flashCells = [];
  let flashStartTime = 0;
  const FLASH_DURATION = 600; // ms

  let hintCells = [];
  let hintStartTime = 0;
  const HINT_DURATION = 2000; // ms

  let animationFrameId = null;
  let onFrame = null;

  function triggerFlash(cells) {
    flashCells = cells;
    flashStartTime = performance.now();
    scheduleFrame();
  }

  function triggerHint(cells) {
    hintCells = cells;
    hintStartTime = performance.now();
    scheduleFrame();
  }

  function getState(now) {
    let flashAlpha = 0;
    if (flashCells.length > 0) {
      const elapsed = now - flashStartTime;
      if (elapsed < FLASH_DURATION) {
        // Pulse effect: flash in then fade out
        const t = elapsed / FLASH_DURATION;
        flashAlpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
      } else {
        flashCells = [];
      }
    }

    let activeHintCells = [];
    if (hintCells.length > 0) {
      const elapsed = now - hintStartTime;
      if (elapsed < HINT_DURATION) {
        // Pulsing glow
        activeHintCells = hintCells;
      } else {
        hintCells = [];
      }
    }

    return {
      flashCells,
      flashAlpha,
      hintCells: activeHintCells,
      isAnimating: flashCells.length > 0 || hintCells.length > 0,
    };
  }

  function scheduleFrame() {
    if (animationFrameId) return;

    function loop() {
      const state = getState(performance.now());
      if (onFrame) onFrame(state);

      if (state.isAnimating) {
        animationFrameId = requestAnimationFrame(loop);
      } else {
        animationFrameId = null;
        // One final frame to clear
        if (onFrame) onFrame(state);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  function setFrameCallback(cb) {
    onFrame = cb;
  }

  function destroy() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  return {
    triggerFlash,
    triggerHint,
    getState,
    setFrameCallback,
    destroy,
  };
}
