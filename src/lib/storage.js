const SCORES_KEY = 'wordsearch_scores';
const GAME_STATE_KEY = 'wordsearch_game_state';

export function getScores() {
  try {
    const data = localStorage.getItem(SCORES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveScore(entry) {
  const scores = getScores();
  scores.push({
    ...entry,
    date: new Date().toISOString(),
  });
  // Keep top 50, sorted by score descending
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, 50);
  localStorage.setItem(SCORES_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearScores() {
  localStorage.removeItem(SCORES_KEY);
}

export function saveGameState(state) {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail on quota errors
  }
}

export function loadGameState() {
  try {
    const data = localStorage.getItem(GAME_STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearGameState() {
  localStorage.removeItem(GAME_STATE_KEY);
}
