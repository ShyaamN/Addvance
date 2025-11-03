import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import type { Question } from "@shared/schema";

interface QuizExportProps {
  questions: Question[];
  topicName: string;
  showAnswers: boolean;
  onToggleAnswers: () => void;
}

export function QuizExport({ questions, topicName, showAnswers, onToggleAnswers }: QuizExportProps) {
  const handlePrintQuestionsOnly = () => {
    const originalShowAnswers = showAnswers;
    onToggleAnswers();
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        if (originalShowAnswers) onToggleAnswers();
      }, 100);
    }, 100);
  };

  const handlePrintWithAnswers = () => {
    const originalShowAnswers = showAnswers;
    if (!showAnswers) onToggleAnswers();
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        if (!originalShowAnswers) onToggleAnswers();
      }, 100);
    }, 100);
  };

  return (
    <div className="flex gap-2 print:hidden">
      <Button variant="outline" onClick={handlePrintQuestionsOnly} size="sm">
        <Printer className="h-4 w-4 mr-2" />
        Questions Only
      </Button>
      <Button variant="outline" onClick={handlePrintWithAnswers} size="sm">
        <Download className="h-4 w-4 mr-2" />
        With Answers
      </Button>
    </div>
  );
}

interface QuizPrintViewProps {
  questions: Question[];
  topicName: string;
  showAnswers: boolean;
  questionShuffles?: Array<Array<{text: string, isCorrect: boolean, origIdx: number}>>;
}

export function QuizPrintView({ questions, topicName, showAnswers, questionShuffles }: QuizPrintViewProps) {
  return (
    <div className="hidden print:block mt-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{topicName}</h1>
        <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-muted-foreground">
          {showAnswers ? 'Questions with Answers' : 'Questions Only'}
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, qIdx) => {
          const shuffledOpts = questionShuffles?.[qIdx];
          const options = shuffledOpts || question.options.map((opt, idx) => ({
            text: opt,
            isCorrect: idx === question.correctAnswer,
            origIdx: idx
          }));
          const correctIdx = options.findIndex(opt => opt.isCorrect);

          return (
            <div key={qIdx} className="border-b pb-4 page-break-inside-avoid">
              <div className="font-semibold mb-2">
                {qIdx + 1}. {question.question}
              </div>
              <div className="ml-4 space-y-1">
                {options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-start">
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className={showAnswers && optIdx === correctIdx ? 'font-bold text-green-600' : ''}>
                      {opt.text}
                      {showAnswers && optIdx === correctIdx && ' ✓'}
                    </span>
                  </div>
                ))}
              </div>
              {showAnswers && question.explanation && (
                <div className="ml-4 mt-2 text-sm text-muted-foreground italic">
                  Explanation: {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @media print {
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
