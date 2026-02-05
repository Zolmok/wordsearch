import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import CategoryPicker from '../components/CategoryPicker.jsx';
import DifficultyPicker from '../components/DifficultyPicker.jsx';

export default function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('animals');
  const [difficulty, setDifficulty] = useState('medium');

  function handleStart() {
    navigate({
      to: '/game',
      search: { category, difficulty },
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold glow-text mb-3">Word Search</h1>
        <p className="text-text-dim">
          Find all the hidden words in the grid
        </p>
      </div>

      <div className="space-y-8">
        <CategoryPicker value={category} onChange={setCategory} />
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />

        <div className="text-center pt-4">
          <button onClick={handleStart} className="btn-primary text-lg px-8 py-3">
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
