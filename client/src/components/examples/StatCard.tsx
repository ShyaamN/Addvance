import StatCard from '../StatCard';
import { Trophy, Target, Flame } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={Trophy}
        label="Total Quizzes"
        value={24}
        trend="+3 this week"
      />
      <StatCard
        icon={Target}
        label="Average Score"
        value="82%"
        color="success"
      />
      <StatCard
        icon={Flame}
        label="Current Streak"
        value="5 days"
        color="warning"
      />
    </div>
  );
}
