import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import YearTopicCard from "@/components/YearTopicCard";
import TopicButton from "@/components/TopicButton";
import DifficultySelector from "@/components/DifficultySelector";
import ModeSelector from "@/components/ModeSelector";
import { Button } from "@/components/ui/button";
import { yearLevels, mockTopics } from "@/data/quizData";
import { storage } from "@/lib/storage";
import { ArrowLeft, BarChart3, Flame, History, Plus, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'foundation' | 'higher'>('foundation');
  const [mode, setMode] = useState<'quiz' | 'study'>('quiz');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const prefs = storage.getPreferences();
    setDifficulty(prefs.difficulty);
    setMode(prefs.studyMode ? 'study' : 'quiz');
    
    const progress = storage.getProgress();
    setStreak(progress.streak);
  }, []);

  const topics = selectedYear 
    ? mockTopics.filter(t => t.yearLevel === selectedYear)
    : [];

  const handleStartQuiz = () => {
    if (selectedTopic) {
      storage.savePreferences({ difficulty, studyMode: mode === 'study' });
      setLocation(`/quiz/${selectedTopic}?difficulty=${difficulty}&mode=${mode}`);
    }
  };

  if (selectedYear) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedTopic(null);
                }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-3xl font-bold font-serif">
                  Year {selectedYear} Topics
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select a topic and customize your quiz
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {topics.map((topic) => (
                <TopicButton
                  key={topic.id}
                  name={topic.name}
                  icon={topic.icon}
                  isSelected={selectedTopic === topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                />
              ))}
            </div>

            {selectedTopic && (
              <div className="space-y-6">
                <DifficultySelector
                  selected={difficulty}
                  onChange={setDifficulty}
                />
                <ModeSelector
                  selected={mode}
                  onChange={setMode}
                />
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto"
                    data-testid="button-start-quiz"
                  >
                    Start {mode === 'quiz' ? 'Quiz' : 'Practice'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-center flex-1">
                <h2 className="text-4xl font-bold font-serif">
                  Choose Your Year Level
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  Select your year to practice GCSE maths topics
                </p>
              </div>
              <div className="flex items-center gap-2">
                {streak > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {streak} day streak
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setLocation("/statistics")}
                data-testid="button-statistics"
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Statistics
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/review")}
                data-testid="button-review"
                className="gap-2"
              >
                <History className="h-4 w-4" />
                Review
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/custom-quiz")}
                data-testid="button-custom-quiz"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Custom Quiz
              </Button>
              <Button
                variant="default"
                onClick={() => setLocation("/teacher-dashboard")}
                data-testid="button-teacher-dashboard"
                className="gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Teacher Dashboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {yearLevels.map((level) => (
              <YearTopicCard
                key={level.year}
                yearLevel={level.year}
                topicCount={level.topics}
                gradeLevel={level.grade}
                onClick={() => level.topics > 0 && setSelectedYear(level.year)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
