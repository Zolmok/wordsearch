export default function ScoreDisplay({ score }) {
  return (
    <div className="font-mono text-lg text-cyan glow-text">
      <span className="text-text-dim text-sm mr-1">SCORE</span>
      {score.toLocaleString()}
    </div>
  );
}
