import ResultsCard from '../ResultsCard';

export default function ResultsCardExample() {
  return (
    <div className="p-8">
      <ResultsCard
        score={8}
        total={10}
        topicName="Quadratics"
        onRetry={() => console.log('Retry quiz')}
        onHome={() => console.log('Go home')}
      />
    </div>
  );
}
