import { calculateFinalScore } from '../game/scoring.js';

export default function GameOverModal({
  score,
  remainingSeconds,
  hintsUsed,
  difficulty,
  foundCount,
  totalWords,
  elapsed,
  onPlayAgain,
  onGoHome,
}) {
  const finalScore = calculateFinalScore(
    score,
    remainingSeconds ?? 0,
    hintsUsed,
    difficulty,
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border-glow glow-border rounded-xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold glow-text mb-2">
          {foundCount >= totalWords ? 'Puzzle Complete!' : 'Time\'s Up!'}
        </h2>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-text-dim">
            <span>Words Found</span>
            <span className="text-text font-mono">
              {foundCount}/{totalWords}
            </span>
          </div>

          <div className="flex justify-between text-text-dim">
            <span>Time</span>
            <span className="text-text font-mono">
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex justify-between text-text-dim">
            <span>Base Score</span>
            <span className="text-text font-mono">{score.toLocaleString()}</span>
          </div>

          {remainingSeconds > 0 && (
            <div className="flex justify-between text-text-dim">
              <span>Time Bonus</span>
              <span className="text-neon-green font-mono">
                +{(Math.floor(remainingSeconds) * 5).toLocaleString()}
              </span>
            </div>
          )}

          {hintsUsed > 0 && (
            <div className="flex justify-between text-text-dim">
              <span>Hint Penalty</span>
              <span className="text-magenta font-mono">
                -{(hintsUsed * 50).toLocaleString()}
              </span>
            </div>
          )}

          <div className="border-t border-border-glow pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Final Score</span>
              <span className="text-2xl font-bold font-mono text-cyan glow-text">
                {finalScore.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-center">
          <button onClick={onPlayAgain} className="btn-primary">
            Play Again
          </button>
          <button onClick={onGoHome} className="btn-secondary">
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
