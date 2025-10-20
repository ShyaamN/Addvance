import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { storage, ACHIEVEMENTS } from "@/lib/storage";
import StatCard from "@/components/StatCard";
import AchievementBadge from "@/components/AchievementBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Flame, Calendar, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Statistics() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const data = storage.getStatistics();
    const prog = storage.getProgress();
    setStats(data);
    setProgress(prog);
  }, []);

  if (!stats || !progress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading statistics...</p>
      </div>
    );
  }

  const allAchievements = Object.values(ACHIEVEMENTS);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">Your Progress</h1>
              <p className="text-muted-foreground mt-1">Track your learning journey</p>
            </div>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              Back to Quizzes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Trophy}
              label="Total Quizzes"
              value={stats.totalAttempts}
            />
            <StatCard
              icon={Target}
              label="Average Score"
              value={`${Math.round(stats.averageScore)}%`}
              color={stats.averageScore >= 80 ? 'success' : stats.averageScore >= 60 ? 'primary' : 'warning'}
            />
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={`${progress.streak} ${progress.streak === 1 ? 'day' : 'days'}`}
              color="warning"
            />
            <StatCard
              icon={Award}
              label="Perfect Scores"
              value={stats.perfectScores}
              color="success"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Topic Performance</h2>
              </div>
              <div className="space-y-4">
                {stats.topicPerformance.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No quiz data yet. Start a quiz to see your performance!
                  </p>
                ) : (
                  stats.topicPerformance.map((topic: any) => (
                    <div key={topic.topicId} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{topic.topicName}</span>
                        <span className="text-muted-foreground">
                          {Math.round(topic.percentage)}% ({topic.attempts} {topic.attempts === 1 ? 'attempt' : 'attempts'})
                        </span>
                      </div>
                      <Progress 
                        value={topic.percentage} 
                        className="h-2"
                      />
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                {stats.recentActivity.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No recent activity. Take a quiz to get started!
                  </p>
                ) : (
                  stats.recentActivity.map((activity: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{activity.topicName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()} • {activity.difficulty}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-lg">
                          {activity.score}/{activity.total}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((activity.score / activity.total) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Achievements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  icon={achievement.icon}
                  name={achievement.name}
                  description={achievement.description}
                  unlocked={progress.achievements.includes(achievement.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
