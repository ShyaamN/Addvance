import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DesmosGraph } from "./DesmosGraph";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  imageUrl?: string;
  graphExpression?: string;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  imageUrl,
  graphExpression
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
        
        {/* Image Display */}
        {imageUrl && (
          <div className="flex justify-center">
            <img 
              src={imageUrl} 
              alt="Question illustration" 
              className="max-w-full h-auto rounded border"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        {/* Desmos Graph Display */}
        {graphExpression && (
          <div className="flex justify-center">
            <DesmosGraph 
              expression={graphExpression} 
              width={500}
              height={350}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
