/**
 * Check if a selection of cells matches any unfound word.
 * Returns the matched word placement or null.
 */
export function validateSelection(cells, words, foundWords) {
  if (cells.length < 2) return null;

  // Build the string from selected cells (forward)
  const forward = cells.map((c) => c.letter).join('');
  // Also check reverse
  const reverse = forward.split('').reverse().join('');

  for (const placement of words) {
    if (foundWords.includes(placement.word)) continue;

    if (placement.word === forward || placement.word === reverse) {
      // Verify the cells actually match the placement cells
      const placementCellSet = new Set(
        placement.cells.map((c) => `${c.row},${c.col}`),
      );
      const selectionCellSet = new Set(
        cells.map((c) => `${c.row},${c.col}`),
      );

      if (
        placementCellSet.size === selectionCellSet.size &&
        [...placementCellSet].every((c) => selectionCellSet.has(c))
      ) {
        return placement;
      }
    }
  }

  return null;
}
