import { useReducer, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { generatePuzzle } from '../game/generator.js';
import { validateSelection } from '../game/validator.js';
import { scoreWord } from '../game/scoring.js';

const initialState = {
  foundWords: [],
  score: 0,
  hintsRemaining: 3,
  hintedWords: {},
  isComplete: false,
  isStarted: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, isStarted: true };

    case 'FIND_WORD': {
      const newFound = [...state.foundWords, action.word];
      const newScore = state.score + action.points;
      const isComplete = newFound.length >= action.totalWords;
      return {
        ...state,
        foundWords: newFound,
        score: newScore,
        isComplete,
      };
    }

    case 'USE_HINT': {
      if (state.hintsRemaining <= 0) return state;

      const hintedWords = { ...state.hintedWords };
      const currentLevel = hintedWords[action.word] || 0;
      hintedWords[action.word] = currentLevel + 1;

      return {
        ...state,
        hintsRemaining: state.hintsRemaining - 1,
        hintedWords,
      };
    }

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export function useGame(category, difficulty) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [seed, setSeed] = useState(0);

  const {
    data: puzzle,
    isLoading,
  } = useQuery({
    queryKey: ['puzzle', category, difficulty, seed],
    queryFn: () => generatePuzzle(category, difficulty),
    staleTime: Infinity,
  });

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const trySelection = useCallback(
    (cells) => {
      if (!puzzle || state.isComplete) return null;

      const match = validateSelection(cells, puzzle.words, state.foundWords);
      if (match) {
        const points = scoreWord(match.word, difficulty);
        dispatch({
          type: 'FIND_WORD',
          word: match.word,
          points,
          totalWords: puzzle.words.length,
        });
        return match;
      }
      return null;
    },
    [puzzle, state.foundWords, state.isComplete, difficulty],
  );

  const useHint = useCallback(() => {
    if (!puzzle || state.hintsRemaining <= 0) return null;

    // Find an unfound word that hasn't been hinted (or hint next level)
    const unfound = puzzle.words.filter(
      (w) => !state.foundWords.includes(w.word),
    );
    if (unfound.length === 0) return null;

    // Prefer unhinted words, then least-hinted
    const sorted = [...unfound].sort(
      (a, b) => (state.hintedWords[a.word] || 0) - (state.hintedWords[b.word] || 0),
    );

    const target = sorted[0];
    const hintLevel = (state.hintedWords[target.word] || 0) + 1;

    dispatch({ type: 'USE_HINT', word: target.word });

    // Return hint info for visual display
    if (hintLevel === 1) {
      // First hint: reveal first letter position
      return { type: 'letter', cells: [target.cells[0]], word: target.word };
    } else {
      // Second+ hint: reveal direction (show first two cells)
      return {
        type: 'direction',
        cells: target.cells.slice(0, 2),
        word: target.word,
      };
    }
  }, [puzzle, state.foundWords, state.hintsRemaining, state.hintedWords]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
    setSeed((s) => s + 1);
  }, []);

  return {
    puzzle,
    isLoading,
    state,
    startGame,
    trySelection,
    useHint,
    resetGame,
  };
}
