import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { mockTopics } from "@/data/quizData";
import QuestionCard from "@/components/QuestionCard";
import AnswerOption from "@/components/AnswerOption";
import ProgressBar from "@/components/ProgressBar";
import Timer from "@/components/Timer";
import FeedbackPanel from "@/components/FeedbackPanel";
import ResultsCard from "@/components/ResultsCard";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Quiz() {
  const [, params] = useRoute("/quiz/:topicId");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const topicId = params?.topicId;

  const searchParams = new URLSearchParams(location.split('?')[1]);
  const difficulty = (searchParams.get('difficulty') || 'foundation') as 'foundation' | 'higher';
  const mode = (searchParams.get('mode') || 'quiz') as 'quiz' | 'study';

  const topic = mockTopics.find(t => t.id === topicId);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (topic) {
      setAnswers(new Array(topic.questions.length).fill(null));
    }
  }, [topic]);

  useEffect(() => {
    if (!isComplete && timeRemaining > 0 && mode === 'quiz') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isComplete, timeRemaining, mode]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Topic not found</h2>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = topic.questions[currentQuestionIndex];
  const score = answers.filter((ans, idx) => 
    ans === topic.questions[idx]?.correctAnswer
  ).length;

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showFeedback) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < topic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Array(topic.questions.length).fill(null));
    setShowFeedback(false);
    setTimeRemaining(300);
    setIsComplete(false);
  };

  const handleGoHome = () => {
    setLocation("/");
  };

  const saveQuizResult = () => {
    if (!topic) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const prevAchievements = storage.getProgress().achievements.length;
    
    storage.addQuizResult({
      topicId: topic.id,
      topicName: topic.name,
      score,
      total: topic.questions.length,
      difficulty,
      timestamp: Date.now(),
      timeSpent,
    });

    const newAchievements = storage.getProgress().achievements.length;
    if (newAchievements > prevAchievements) {
      toast({
        title: "🎉 New Achievement Unlocked!",
        description: "Check your statistics to see your new badge",
      });
    }
  };

  useEffect(() => {
    if (isComplete && topic) {
      saveQuizResult();
    }
  }, [isComplete]);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <ResultsCard
            score={score}
            total={topic.questions.length}
            topicName={topic.name}
            onRetry={handleRetry}
            onHome={handleGoHome}
          />
        </div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <ProgressBar
                current={currentQuestionIndex + 1}
                total={topic.questions.length}
              />
              <Badge variant="outline">
                {difficulty === 'foundation' ? 'Foundation' : 'Higher'}
              </Badge>
              {mode === 'study' && (
                <Badge variant="secondary">Study Mode</Badge>
              )}
            </div>
            {mode === 'quiz' && <Timer timeRemaining={timeRemaining} />}
          </div>

          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={topic.questions.length}
            question={currentQuestion.question}
          />

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <AnswerOption
                key={idx}
                option={option}
                label={String.fromCharCode(65 + idx)}
                isSelected={selectedAnswer === idx}
                isCorrect={showFeedback && idx === currentQuestion.correctAnswer}
                isIncorrect={showFeedback && selectedAnswer === idx && idx !== currentQuestion.correctAnswer}
                disabled={showFeedback}
                onClick={() => handleAnswerSelect(idx)}
              />
            ))}
          </div>

          {!showFeedback && selectedAnswer !== null && (
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleSubmitAnswer}
                data-testid="button-submit"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {showFeedback && (
            <FeedbackPanel
              isCorrect={isCorrect}
              explanation={currentQuestion.explanation}
              onNext={handleNextQuestion}
            />
          )}
        </div>
      </div>
    </div>
  );
}
