import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
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
import type { Topic } from "@shared/schema";

export default function Quiz() {
  const [, params] = useRoute("/quiz/:topicId");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const topicId = params?.topicId;
  const quizContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const searchParams = new URLSearchParams(location.split('?')[1]);
  const difficulty = (searchParams.get('difficulty') || 'foundation') as 'foundation' | 'higher';
  const mode = (searchParams.get('mode') || 'quiz') as 'quiz' | 'study';

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTopic = async () => {
      try {
        const response = await fetch(`/api/topics/${topicId}`);
        if (response.ok) {
          const data = await response.json();
          setTopic(data);
        }
      } catch (error) {
        console.error('Failed to load topic:', error);
      } finally {
        setLoading(false);
      }
    };
    if (topicId) loadTopic();
  }, [topicId]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  // Store shuffled options for each question to properly track correct answers
  const [questionShuffles, setQuestionShuffles] = useState<Array<Array<{text: string, isCorrect: boolean, origIdx: number}>>>([]);
  const [showAnswersForExport, setShowAnswersForExport] = useState(false);

  useEffect(() => {
    if (topic) {
      setAnswers(new Array(topic.questions.length).fill(null));
      // Pre-shuffle all questions
      const shuffles = topic.questions.map(q => {
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

  // Shuffle options for each question
  const currentQuestion = topic.questions[currentQuestionIndex];
  const shuffledOptions = questionShuffles[currentQuestionIndex] || [];
  // Find new correct answer index after shuffle
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
    
    // Re-shuffle all questions for retry
    if (topic) {
      const shuffles = topic.questions.map(q => {
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
    }
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

  const isCorrect = selectedAnswer === newCorrectIndex;

  return (
    <div ref={quizContainerRef} className={`min-h-screen bg-background ${isFullscreen ? 'fullscreen-quiz' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen(quizContainerRef.current || undefined)}
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
                questions={topic.questions}
                topicName={topic.name}
                showAnswers={showAnswersForExport}
                onToggleAnswers={() => setShowAnswersForExport(!showAnswersForExport)}
              />
              {mode === 'quiz' && <Timer timeRemaining={timeRemaining} />}
            </div>
          </div>

          <div className="print:hidden">
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={topic.questions.length}
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
        </div>

        {/* Print View */}
        <QuizPrintView
          questions={topic.questions}
          topicName={topic.name}
          showAnswers={showAnswersForExport}
          questionShuffles={questionShuffles}
        />
      </div>
      
      {/* Fullscreen styles */}
      <style>{`
        .fullscreen-quiz {
          width: 100vw;
          height: 100vh;
          overflow: auto;
          padding: 2rem;
          box-sizing: border-box;
        }
        
        .fullscreen-quiz .container {
          max-width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 0;
        }
        
        .fullscreen-quiz .max-w-4xl {
          max-width: 100%;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        /* Controls at top */
        .fullscreen-quiz .space-y-6 > div:first-child {
          flex-shrink: 0;
          margin-bottom: 2rem;
        }
        
        /* Question content area */
        .fullscreen-quiz .space-y-6 > div:last-child {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 0;
        }
        
        /* Larger question card in fullscreen */
        .fullscreen-quiz .space-y-6 > div:not(.print\\:hidden) {
          padding: 3rem;
          border-radius: 1rem;
        }
        
        .fullscreen-quiz h2 {
          font-size: 2.5rem;
          line-height: 1.3;
          font-weight: 600;
        }
        
        /* Larger answer options */
        .fullscreen-quiz button[data-testid^="answer-"] {
          min-height: 100px;
          font-size: 1.75rem;
          padding: 1.5rem 2rem;
          border-width: 3px;
        }
        
        .fullscreen-quiz button[data-testid^="answer-"] .text-xl {
          font-size: 2rem;
        }
        
        /* Larger submit button */
        .fullscreen-quiz button[data-testid="button-submit"] {
          font-size: 1.5rem;
          padding: 1.5rem 3rem;
          min-height: 70px;
        }
        
        /* Larger feedback panel */
        .fullscreen-quiz .space-y-4 > div {
          font-size: 1.5rem;
        }
        
        @media (max-width: 1200px) {
          .fullscreen-quiz h2 {
            font-size: 2rem;
          }
          .fullscreen-quiz button[data-testid^="answer-"] {
            font-size: 1.5rem;
          }
        }
        
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}

