import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question
}: QuestionCardProps) {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="default" data-testid="badge-question-number">
            Question {questionNumber} of {totalQuestions}
          </Badge>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold leading-relaxed" data-testid="text-question">
          {question}
        </h2>
      </div>
    </Card>
  );
}
