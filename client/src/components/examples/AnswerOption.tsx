import AnswerOption from '../AnswerOption';
import { useState } from 'react';

export default function AnswerOptionExample() {
  const [selected, setSelected] = useState(false);
  
  return (
    <div className="p-8 max-w-2xl space-y-4">
      <AnswerOption
        option="x = 4"
        label="A"
        isSelected={selected}
        onClick={() => setSelected(!selected)}
      />
      <AnswerOption
        option="x = 8"
        label="B"
        isSelected={false}
        isCorrect={true}
        onClick={() => console.log('Correct answer')}
      />
      <AnswerOption
        option="x = 2"
        label="C"
        isSelected={false}
        isIncorrect={true}
        onClick={() => console.log('Wrong answer')}
      />
    </div>
  );
}
