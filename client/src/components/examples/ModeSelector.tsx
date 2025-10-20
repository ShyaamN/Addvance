import ModeSelector from '../ModeSelector';
import { useState } from 'react';

export default function ModeSelectorExample() {
  const [mode, setMode] = useState<'quiz' | 'study'>('quiz');
  
  return (
    <div className="p-8 max-w-md">
      <ModeSelector selected={mode} onChange={setMode} />
    </div>
  );
}
