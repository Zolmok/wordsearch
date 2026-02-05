const DIFFICULTY_MULTIPLIER = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const HINT_PENALTY = 50;
const TIME_BONUS_PER_SECOND = 5;

export function scoreWord(word, difficulty) {
  const base = word.length * 10;
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty] || 1;
  return base * multiplier;
}

export function calculateTimeBonus(remainingSeconds, difficulty) {
  if (difficulty === 'easy') return 0; // No timer on easy
  return Math.max(0, Math.floor(remainingSeconds) * TIME_BONUS_PER_SECOND);
}

export function calculateHintPenalty(hintsUsed) {
  return hintsUsed * HINT_PENALTY;
}

export function calculateFinalScore(score, remainingSeconds, hintsUsed, difficulty) {
  const timeBonus = calculateTimeBonus(remainingSeconds, difficulty);
  const penalty = calculateHintPenalty(hintsUsed);
  return Math.max(0, score + timeBonus - penalty);
}
