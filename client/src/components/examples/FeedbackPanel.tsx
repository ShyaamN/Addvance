import FeedbackPanel from '../FeedbackPanel';

export default function FeedbackPanelExample() {
  return (
    <div className="p-8 max-w-2xl space-y-4">
      <FeedbackPanel
        isCorrect={true}
        explanation="Great work! To solve 2x + 5 = 13, subtract 5 from both sides to get 2x = 8, then divide by 2 to find x = 4."
        onNext={() => console.log('Next question')}
      />
      <FeedbackPanel
        isCorrect={false}
        explanation="Not quite. Remember to subtract 5 from both sides first: 2x + 5 - 5 = 13 - 5, which gives 2x = 8. Then divide both sides by 2."
        onNext={() => console.log('Next question')}
      />
    </div>
  );
}
