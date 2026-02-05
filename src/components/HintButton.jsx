export default function HintButton({ hintsRemaining, onUseHint, disabled }) {
  return (
    <button
      onClick={onUseHint}
      disabled={disabled || hintsRemaining <= 0}
      className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      Hint ({hintsRemaining})
    </button>
  );
}
