import QuestionCard from '../QuestionCard';

export default function QuestionCardExample() {
  return (
    <div className="p-8 max-w-3xl">
      <QuestionCard
        questionNumber={3}
        totalQuestions={10}
        question="Solve for x: 2x + 5 = 13"
      />
    </div>
  );
}
