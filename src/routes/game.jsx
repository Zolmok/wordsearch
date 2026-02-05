import { useState, useCallback, useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useGame } from '../hooks/useGame.js';
import { useTimer } from '../hooks/useTimer.js';
import { useDragSelection } from '../hooks/useDragSelection.js';
import { calculateFinalScore } from '../game/scoring.js';
import { saveScore } from '../lib/storage.js';
import GameCanvas from '../components/GameCanvas.jsx';
import GameHeader from '../components/GameHeader.jsx';
import WordList from '../components/WordList.jsx';
import GameOverModal from '../components/GameOverModal.jsx';

export default function Game() {
  const { category, difficulty } = useSearch({ strict: false });
  const navigate = useNavigate();
  const { puzzle, isLoading, state, startGame, trySelection, useHint, resetGame } =
    useGame(category, difficulty);
  const [gameOver, setGameOver] = useState(false);
  const timer = useTimer(difficulty, state.isStarted && !state.isComplete && !gameOver);
  const { selectionCells, updateSelection, clearSelection } = useDragSelection();
  const [hintCells, setHintCells] = useState([]);
  const [endSnapshot, setEndSnapshot] = useState(null);

  // Auto-start game when puzzle is ready
  useEffect(() => {
    if (puzzle && !state.isStarted) {
      startGame();
    }
  }, [puzzle, state.isStarted, startGame]);

  // Show game over when complete or time expires
  useEffect(() => {
    if ((state.isComplete || timer.isExpired) && !gameOver) {
      setGameOver(true);

      // Snapshot timer values at the moment the game ends
      const remaining = timer.remaining ?? 0;
      const elapsed = timer.elapsed;
      setEndSnapshot({ remaining, elapsed });

      // Save score
      const hintsUsed = 3 - state.hintsRemaining;
      const finalScore = calculateFinalScore(
        state.score,
        remaining,
        hintsUsed,
        difficulty,
      );

      saveScore({
        score: finalScore,
        category,
        difficulty,
        wordsFound: state.foundWords.length,
        totalWords: puzzle?.words.length ?? 0,
        time: elapsed,
      });
    }
  }, [
    state.isComplete,
    timer.isExpired,
    gameOver,
    state.score,
    state.hintsRemaining,
    state.foundWords.length,
    timer.remaining,
    timer.elapsed,
    difficulty,
    category,
    puzzle,
  ]);

  const handleSelectionEnd = useCallback(
    (cells) => {
      const match = trySelection(cells);
      clearSelection();
      return match;
    },
    [trySelection, clearSelection],
  );

  const handleHint = useCallback(() => {
    const hint = useHint();
    if (hint) {
      setHintCells(hint.cells);
      // Clear hint display after animation
      setTimeout(() => setHintCells([]), 2500);
    }
  }, [useHint]);

  const handlePlayAgain = useCallback(() => {
    setGameOver(false);
    setEndSnapshot(null);
    timer.reset();
    resetGame();
  }, [resetGame, timer]);

  const handleGoHome = useCallback(() => {
    navigate({ to: '/' });
  }, [navigate]);

  if (isLoading || !puzzle) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-cyan glow-text text-xl">Generating puzzle...</div>
      </div>
    );
  }

  // Build found word placement data
  const foundWordPlacements = puzzle.words.filter((w) =>
    state.foundWords.includes(w.word),
  );

  return (
    <div className="h-screen flex flex-col">
      <GameHeader
        score={state.score}
        displayTime={timer.displayTime}
        isTimed={timer.isTimed}
        isExpired={timer.isExpired}
        hintsRemaining={state.hintsRemaining}
        onUseHint={handleHint}
        isComplete={state.isComplete}
        category={category}
        difficulty={difficulty}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <GameCanvas
            grid={puzzle.grid}
            gridSize={puzzle.gridSize}
            foundWords={foundWordPlacements}
            selectionCells={selectionCells}
            onSelectionChange={updateSelection}
            onSelectionEnd={handleSelectionEnd}
            hintCells={hintCells}
          />
        </div>

        <div className="lg:w-64 shrink-0">
          <WordList
            words={puzzle.words}
            foundWords={state.foundWords}
          />
        </div>
      </div>

      {gameOver && endSnapshot && (
        <GameOverModal
          score={state.score}
          remainingSeconds={endSnapshot.remaining}
          hintsUsed={3 - state.hintsRemaining}
          difficulty={difficulty}
          foundCount={state.foundWords.length}
          totalWords={puzzle.words.length}
          elapsed={endSnapshot.elapsed}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
