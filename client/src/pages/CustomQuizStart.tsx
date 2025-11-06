import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import type { Question, Topic } from "@shared/schema";
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
import { QuizExport, QuizPrintView } from "@/components/QuizExport";
import { Eye, EyeOff, Maximize, Minimize } from "lucide-react";
import { useFullscreen } from "@/hooks/use-fullscreen";

export default function CustomQuizStart() {
  const [location, setLocationHook] = useLocation();
  const { toast } = useToast();
  const customQuizRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const searchParams = new URLSearchParams(location.split('?')[1]);
  const topicIds = searchParams.get('topics')?.split(',') || [];
  const count = parseInt(searchParams.get('count') || '10');
  const difficulty = (searchParams.get('difficulty') || 'foundation') as 'foundation' | 'higher';

  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionShuffles, setQuestionShuffles] = useState<Array<Array<{text: string, isCorrect: boolean, origIdx: number}>>>([]);
  const [showAnswersForExport, setShowAnswersForExport] = useState(false);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await fetch('/api/topics');
        if (response.ok) {
          const data = await response.json();
          setTopics(data);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      }
    };
    loadTopics();
  }, []);

  useEffect(() => {
    if (topics.length === 0) return;
    
    // Gather questions from selected topics
    const allQuestions: Question[] = [];
    topicIds.forEach(topicId => {
      const topic = topics.find(t => t.id === topicId);
      if (topic) {
        allQuestions.push(...topic.questions);
      }
    });

    // Shuffle and select the requested number
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    setQuestions(selected);
    setAnswers(new Array(selected.length).fill(null));

    // Pre-shuffle all question options
    const shuffles = selected.map(q => {
      const options = q.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === q.correctAnswer,
        origIdx: idx
      }));
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return options;
    });
    setQuestionShuffles(shuffles);
  }, []);

  useEffect(() => {
    if (!isComplete && timeRemaining > 0) {
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
  }, [isComplete, timeRemaining]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading questions...</h2>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledOptions = questionShuffles[currentQuestionIndex] || [];
  const newCorrectIndex = shuffledOptions.findIndex(opt => opt.isCorrect);
  
  const score = answers.filter((ans, idx) => {
    if (ans === null) return false;
    const questionShuffle = questionShuffles[idx];
    if (!questionShuffle) return false;
    const correctIdx = questionShuffle.findIndex(opt => opt.isCorrect);
    return ans === correctIdx;
  }).length;

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setLocationHook("/custom-quiz");
  };

  const handleGoHome = () => {
    setLocationHook("/");
  };

  const saveQuizResult = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const prevAchievements = storage.getProgress().achievements.length;
    
    storage.addQuizResult({
      topicId: 'custom-quiz',
      topicName: 'Custom Quiz',
      score,
      total: questions.length,
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
    if (isComplete && questions.length > 0) {
      saveQuizResult();
    }
  }, [isComplete]);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <ResultsCard
            score={score}
            total={questions.length}
            topicName="Custom Quiz"
            onRetry={handleRetry}
            onHome={handleGoHome}
          />
        </div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === newCorrectIndex;

  return (
    <div ref={customQuizRef} className={`min-h-screen bg-background ${isFullscreen ? 'fullscreen-quiz' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3 flex-1">
              <ProgressBar
                current={currentQuestionIndex + 1}
                total={questions.length}
              />
              <Badge variant="outline">
                {difficulty === 'foundation' ? 'Foundation' : 'Higher'}
              </Badge>
              <Badge variant="secondary">Custom Quiz</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen(customQuizRef.current || undefined)}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswersForExport(!showAnswersForExport)}
              >
                {showAnswersForExport ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Answers
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Answers
                  </>
                )}
              </Button>
              <QuizExport
                questions={questions}
                topicName="Custom Quiz"
                showAnswers={showAnswersForExport}
                onToggleAnswers={() => setShowAnswersForExport(!showAnswersForExport)}
              />
              <Timer timeRemaining={timeRemaining} />
            </div>
          </div>

          <div className="print:hidden">
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              question={currentQuestion.question}
              imageUrl={currentQuestion.imageUrl}
              graphExpression={currentQuestion.graphExpression}
            />

            <div className="space-y-3">
              {shuffledOptions.map((option, idx) => (
                <AnswerOption
                  key={idx}
                  option={option.text}
                  label={String.fromCharCode(65 + idx)}
                  isSelected={selectedAnswer === idx}
                  isCorrect={showFeedback && idx === newCorrectIndex}
                  isIncorrect={showFeedback && selectedAnswer === idx && idx !== newCorrectIndex}
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

          {/* Print View */}
          <QuizPrintView
            questions={questions}
            topicName="Custom Quiz"
            showAnswers={showAnswersForExport}
            questionShuffles={questionShuffles}
          />
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
        
        /* Fullscreen styles */
        .fullscreen-quiz {
          width: 100vw;
          height: 100vh;
          overflow: auto;
        }
        
        .fullscreen-quiz .container {
          max-width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 2rem;
        }
        
        .fullscreen-quiz .max-w-4xl {
          max-width: 100%;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .fullscreen-quiz .space-y-6 > div:not(.print\\:hidden) {
          padding: 3rem;
          border-radius: 1rem;
        }
        
        .fullscreen-quiz h2 {
          font-size: 2.5rem;
          line-height: 1.3;
          font-weight: 600;
        }
        
        .fullscreen-quiz button[data-testid^="answer-"] {
          min-height: 100px;
          font-size: 1.75rem;
          padding: 1.5rem 2rem;
          border-width: 3px;
        }
        
        .fullscreen-quiz button[data-testid="button-submit"] {
          font-size: 1.5rem;
          padding: 1.5rem 3rem;
          min-height: 70px;
        }
        
        .fullscreen-quiz .print\\:hidden {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: hsl(var(--background) / 0.95);
          backdrop-filter: blur(8px);
          padding: 1rem 2rem;
          border-bottom: 1px solid hsl(var(--border));
          transition: opacity 0.3s;
        }
        
        .fullscreen-quiz .print\\:hidden:not(:hover):not(:focus-within) {
          opacity: 0.3;
        }
        
        @media (max-width: 1200px) {
          .fullscreen-quiz h2 {
            font-size: 2rem;
          }
          .fullscreen-quiz button[data-testid^="answer-"] {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
