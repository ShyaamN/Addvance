import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { storage } from "@/lib/storage";
import { mockTopics } from "@/data/quizData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Eye, EyeOff, BookOpen } from "lucide-react";

interface WrongAnswer {
  topicName: string;
  topicId: string;
  questionId: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: number;
}

export default function Review() {
  const [, setLocation] = useLocation();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  useEffect(() => {
    const progress = storage.getProgress();
    const wrong: WrongAnswer[] = [];

    progress.quizHistory.forEach(result => {
      const topic = mockTopics.find(t => t.id === result.topicId);
      if (!topic) return;

      // In a real app, we'd track individual wrong answers
      // For now, we'll show some example wrong answers
      if (result.score < result.total) {
        topic.questions.slice(0, result.total - result.score).forEach((q, idx) => {
          wrong.push({
            topicName: result.topicName,
            topicId: result.topicId,
            questionId: q.id,
            question: q.question,
            yourAnswer: q.options[(q.correctAnswer + 1) % q.options.length],
            correctAnswer: q.options[q.correctAnswer],
            explanation: q.explanation,
            timestamp: result.timestamp,
          });
        });
      }
    });

    setWrongAnswers(wrong.slice(0, 20)); // Show last 20
  }, []);

  const toggleRevealAnswer = (index: number) => {
    setRevealedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const revealAllAnswers = () => {
    setShowAllAnswers(true);
    setRevealedAnswers(new Set(wrongAnswers.map((_, i) => i)));
  };

  const hideAllAnswers = () => {
    setShowAllAnswers(false);
    setRevealedAnswers(new Set());
  };

  const handlePracticeQuiz = () => {
    // Create a custom quiz with the wrong answer topics
    const topicIds = Array.from(new Set(wrongAnswers.map(wa => wa.topicId)));
    if (topicIds.length > 0) {
      setLocation(`/custom-quiz?topics=${topicIds.join(',')}&mode=practice`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">Review Wrong Answers</h1>
              <p className="text-muted-foreground mt-1">
                Learn from your mistakes to improve
              </p>
            </div>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              Back to Quizzes
            </Button>
          </div>

          {wrongAnswers.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Perfect Record!</h3>
              <p className="text-muted-foreground">
                You haven't gotten any questions wrong yet. Keep up the great work!
              </p>
            </Card>
          ) : (
            <>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={showAllAnswers ? hideAllAnswers : revealAllAnswers}
                >
                  {showAllAnswers ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide All Answers
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show All Answers
                    </>
                  )}
                </Button>
                <Button onClick={handlePracticeQuiz}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Practice Quiz from Wrong Answers
                </Button>
              </div>

              <div className="space-y-4">
                {wrongAnswers.map((item, idx) => {
                  const isRevealed = revealedAnswers.has(idx);
                  
                  return (
                    <Card key={idx} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2">
                              {item.topicName}
                            </Badge>
                            <h3 className="text-lg font-semibold">{item.question}</h3>
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Show/Hide Answer Button */}
                        <Button
                          variant={isRevealed ? "secondary" : "default"}
                          size="sm"
                          onClick={() => toggleRevealAnswer(idx)}
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide Answer
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Show Answer
                            </>
                          )}
                        </Button>

                        {/* Answers (Only shown when revealed) */}
                        {isRevealed && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                                  <XCircle className="h-4 w-4" />
                                  Your Answer
                                </div>
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                  <p className="text-sm">{item.yourAnswer}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-500">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Correct Answer
                                </div>
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                                  <p className="text-sm">{item.correctAnswer}</p>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t">
                              <p className="text-sm font-medium mb-2">Explanation:</p>
                              <p className="text-sm text-muted-foreground">{item.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
