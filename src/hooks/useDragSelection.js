import { useState, useCallback } from 'react';

export function useDragSelection() {
  const [selectionCells, setSelectionCells] = useState([]);

  const updateSelection = useCallback((cells) => {
    setSelectionCells(cells);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectionCells([]);
  }, []);

  return {
    selectionCells,
    updateSelection,
    clearSelection,
  };
}
