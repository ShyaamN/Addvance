import { useState } from "react";
import { useLocation } from "wouter";
import { mockTopics } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import DifficultySelector from "@/components/DifficultySelector";
import { ArrowLeft } from "lucide-react";

export default function CustomQuiz() {
  const [, setLocation] = useLocation();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState([10]);
  const [difficulty, setDifficulty] = useState<'foundation' | 'higher'>('foundation');

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStartCustomQuiz = () => {
    if (selectedTopics.length > 0) {
      const topicIds = selectedTopics.join(',');
      setLocation(`/custom-quiz/start?topics=${topicIds}&count=${questionCount[0]}&difficulty=${difficulty}`);
    }
  };

  const groupedTopics = mockTopics.reduce((acc, topic) => {
    const year = `Year ${topic.yearLevel}`;
    if (!acc[year]) acc[year] = [];
    acc[year].push(topic);
    return acc;
  }, {} as Record<string, typeof mockTopics>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-serif">Custom Quiz Builder</h1>
              <p className="text-muted-foreground mt-1">
                Mix topics and set your own question count
              </p>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Question Count: {questionCount[0]}</h3>
            <Slider
              value={questionCount}
              onValueChange={setQuestionCount}
              min={5}
              max={30}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Select between 5 and 30 questions
            </p>
          </Card>

          <DifficultySelector
            selected={difficulty}
            onChange={setDifficulty}
          />

          <div>
            <h3 className="text-lg font-semibold mb-4">Select Topics ({selectedTopics.length} selected)</h3>
            <div className="space-y-6">
              {Object.entries(groupedTopics).map(([year, topics]) => (
                <div key={year}>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">{year}</h4>
                  <div className="grid gap-3">
                    {topics.map((topic) => (
                      <Card
                        key={topic.id}
                        className="p-4 cursor-pointer hover-elevate active-elevate-2"
                        onClick={() => toggleTopic(topic.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedTopics.includes(topic.id)}
                            onCheckedChange={() => toggleTopic(topic.id)}
                            data-testid={`checkbox-topic-${topic.id}`}
                          />
                          <Label className="flex-1 cursor-pointer font-medium">
                            {topic.icon} {topic.name}
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {topic.questions.length} questions
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleStartCustomQuiz}
              disabled={selectedTopics.length === 0}
              data-testid="button-start-custom-quiz"
              className="w-full sm:w-auto"
            >
              Start Custom Quiz ({selectedTopics.length} {selectedTopics.length === 1 ? 'topic' : 'topics'})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
