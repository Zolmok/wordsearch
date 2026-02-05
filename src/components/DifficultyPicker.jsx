const DIFFICULTIES = [
  {
    key: 'easy',
    label: 'Easy',
    desc: '8 words, no timer',
    color: 'text-neon-green',
    borderColor: 'border-neon-green',
    bgColor: 'bg-neon-green/10',
  },
  {
    key: 'medium',
    label: 'Medium',
    desc: '12 words, 5 min timer',
    color: 'text-cyan',
    borderColor: 'border-cyan',
    bgColor: 'bg-cyan/10',
  },
  {
    key: 'hard',
    label: 'Hard',
    desc: '16 words, 3 min timer',
    color: 'text-magenta',
    borderColor: 'border-magenta',
    bgColor: 'bg-magenta/10',
  },
];

export default function DifficultyPicker({ value, onChange }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-dim mb-3 uppercase tracking-wider">
        Difficulty
      </h3>
      <div className="flex gap-3">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.key}
            onClick={() => onChange(d.key)}
            className={`flex-1 px-4 py-3 rounded-lg border text-center transition-all ${
              value === d.key
                ? `${d.borderColor} ${d.bgColor} ${d.color} glow-border`
                : 'border-border-glow text-text-dim hover:text-text'
            }`}
          >
            <div className="font-semibold text-sm">{d.label}</div>
            <div className="text-xs mt-1 opacity-70">{d.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
