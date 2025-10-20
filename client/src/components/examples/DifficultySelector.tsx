import DifficultySelector from '../DifficultySelector';
import { useState } from 'react';

export default function DifficultySelectorExample() {
  const [difficulty, setDifficulty] = useState<'foundation' | 'higher'>('foundation');
  
  return (
    <div className="p-8 max-w-md">
      <DifficultySelector selected={difficulty} onChange={setDifficulty} />
    </div>
  );
}
