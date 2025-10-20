import TopicButton from '../TopicButton';
import { useState } from 'react';

export default function TopicButtonExample() {
  const [selected, setSelected] = useState(false);
  
  return (
    <div className="p-8 max-w-sm">
      <TopicButton
        name="Quadratics"
        icon="circle"
        isSelected={selected}
        onClick={() => setSelected(!selected)}
      />
    </div>
  );
}
