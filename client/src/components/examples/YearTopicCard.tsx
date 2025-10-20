import YearTopicCard from '../YearTopicCard';

export default function YearTopicCardExample() {
  return (
    <div className="p-8 max-w-md">
      <YearTopicCard
        yearLevel={9}
        topicCount={6}
        gradeLevel="GCSE"
        onClick={() => console.log('Year 9 clicked')}
      />
    </div>
  );
}
