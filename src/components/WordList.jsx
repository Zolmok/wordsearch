export default function WordList({ words, foundWords }) {
  return (
    <div className="bg-bg-card rounded-lg border border-border-glow glow-border p-4">
      <h3 className="text-sm font-semibold text-text-dim mb-3 uppercase tracking-wider">
        Words ({foundWords.length}/{words.length})
      </h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {words.map((wp) => {
          const found = foundWords.includes(wp.word);
          return (
            <div
              key={wp.word}
              className={`font-mono text-sm py-0.5 transition-all ${
                found
                  ? 'text-neon-green line-through opacity-60'
                  : 'text-text'
              }`}
            >
              {wp.word}
            </div>
          );
        })}
      </div>
    </div>
  );
}
