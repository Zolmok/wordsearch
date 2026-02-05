import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getScores, clearScores } from '../lib/storage.js';

export default function Scores() {
  const queryClient = useQueryClient();

  const { data: scores = [] } = useQuery({
    queryKey: ['scores'],
    queryFn: getScores,
    staleTime: 0,
  });

  const clearMutation = useMutation({
    mutationFn: () => {
      clearScores();
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(['scores'], []);
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold glow-text">High Scores</h1>
        {scores.length > 0 && (
          <button
            onClick={() => clearMutation.mutate()}
            className="btn-secondary text-sm px-3 py-1.5"
          >
            Clear All
          </button>
        )}
      </div>

      {scores.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-dim text-lg">No scores yet.</p>
          <p className="text-text-dim text-sm mt-2">
            Complete a puzzle to see your score here!
          </p>
        </div>
      ) : (
        <div className="bg-bg-card border border-border-glow glow-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-glow text-text-dim text-sm uppercase tracking-wider">
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Difficulty</th>
                <th className="text-left px-4 py-3">Words</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, i) => (
                <tr
                  key={i}
                  className="border-b border-border-glow/50 hover:bg-cyan/5 transition-colors"
                >
                  <td className="px-4 py-3 text-text-dim font-mono">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-cyan">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize">{entry.category}</td>
                  <td className="px-4 py-3 capitalize">{entry.difficulty}</td>
                  <td className="px-4 py-3 font-mono">
                    {entry.wordsFound}/{entry.totalWords}
                  </td>
                  <td className="px-4 py-3 text-text-dim text-sm">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
