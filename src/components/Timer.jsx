import { formatTime } from '../hooks/useTimer.js';

export default function Timer({ displayTime, isTimed }) {
  const urgent = isTimed && displayTime <= 30;

  return (
    <div
      className={`font-mono text-lg ${urgent ? 'text-magenta glow-text-magenta' : 'text-cyan glow-text'}`}
    >
      <span className="text-text-dim text-sm mr-1">TIME</span>
      {formatTime(displayTime)}
    </div>
  );
}
