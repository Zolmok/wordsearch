import { Link } from '@tanstack/react-router';
import Timer from './Timer.jsx';
import ScoreDisplay from './ScoreDisplay.jsx';
import HintButton from './HintButton.jsx';

export default function GameHeader({
  score,
  displayTime,
  isTimed,
  isExpired,
  hintsRemaining,
  onUseHint,
  isComplete,
  category,
  difficulty,
}) {
  return (
    <header className="bg-bg-card border-b border-border-glow px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold glow-text no-underline">
            Word Search
          </Link>
          <span className="text-text-dim text-sm">
            {category} &middot; {difficulty}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Timer
            displayTime={displayTime}
            isTimed={isTimed}
            isExpired={isExpired}
          />
          <ScoreDisplay score={score} />
          <HintButton
            hintsRemaining={hintsRemaining}
            onUseHint={onUseHint}
            disabled={isComplete}
          />
        </div>
      </div>
    </header>
  );
}
