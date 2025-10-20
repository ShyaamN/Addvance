import AchievementBadge from '../AchievementBadge';

export default function AchievementBadgeExample() {
  return (
    <div className="p-8 max-w-md space-y-4">
      <AchievementBadge
        icon="⭐"
        name="Perfect Score"
        description="Get 100% on a quiz"
        unlocked={true}
      />
      <AchievementBadge
        icon="🏆"
        name="Quiz Master"
        description="Complete 10 quizzes"
        unlocked={false}
      />
    </div>
  );
}
