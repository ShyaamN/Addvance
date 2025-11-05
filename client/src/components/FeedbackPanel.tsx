import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import MathText from "./MathText";

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation: string;
  onNext: () => void;
}

export default function FeedbackPanel({
  isCorrect,
  explanation,
  onNext
}: FeedbackPanelProps) {
  return (
    <Card
      className={cn(
        "p-6",
        isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"
      )}
      data-testid="feedback-panel"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isCorrect ? "bg-green-500" : "bg-red-500"
            )}
          >
            {isCorrect ? (
              <Check className="h-6 w-6 text-white" />
            ) : (
              <X className="h-6 w-6 text-white" />
            )}
          </div>
          <h3 className="text-xl font-bold">
            {isCorrect ? "Correct!" : "Not quite!"}
          </h3>
        </div>
        <p className="text-base leading-relaxed" data-testid="text-explanation">
          <MathText>{explanation}</MathText>
        </p>
        <Button
          onClick={onNext}
          className="w-full sm:w-auto"
          data-testid="button-next"
        >
          Next Question
        </Button>
      </div>
    </Card>
  );
}
