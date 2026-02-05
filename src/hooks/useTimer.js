import { useState, useEffect, useRef, useCallback } from 'react';

const DIFFICULTY_TIME_LIMITS = {
  easy: null,    // No time limit
  medium: 300,   // 5 minutes
  hard: 180,     // 3 minutes
};

export function useTimer(difficulty, isActive) {
  const timeLimit = DIFFICULTY_TIME_LIMITS[difficulty];
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const remaining = timeLimit ? Math.max(0, timeLimit - elapsed) : null;
  const isExpired = timeLimit !== null && elapsed >= timeLimit;

  const reset = useCallback(() => {
    setElapsed(0);
  }, []);

  return {
    elapsed,
    remaining,
    isExpired,
    timeLimit,
    reset,
    displayTime: remaining !== null ? remaining : elapsed,
    isTimed: timeLimit !== null,
  };
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
