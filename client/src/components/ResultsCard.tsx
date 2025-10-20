import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  score: number;
  total: number;
  topicName: string;
  onRetry: () => void;
  onHome: () => void;
}

export default function ResultsCard({
  score,
  total,
  topicName,
  onRetry,
  onHome
}: ResultsCardProps) {
  const percentage = (score / total) * 100;
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60 && percentage < 80;

  const getMessage = () => {
    if (isExcellent) return "Excellent work! 🎉";
    if (isGood) return "Good job! Keep practicing!";
    return "Keep practicing! You'll get there!";
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-full",
              isExcellent && "bg-green-100 dark:bg-green-900/30",
              isGood && "bg-blue-100 dark:bg-blue-900/30",
              !isExcellent && !isGood && "bg-orange-100 dark:bg-orange-900/30"
            )}
          >
            <Trophy
              className={cn(
                "h-12 w-12",
                isExcellent && "text-green-600 dark:text-green-400",
                isGood && "text-blue-600 dark:text-blue-400",
                !isExcellent && !isGood && "text-orange-600 dark:text-orange-400"
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-serif">{getMessage()}</h2>
          <p className="text-muted-foreground">{topicName} Quiz Complete</p>
        </div>

        <div className="py-6">
          <div className="text-6xl font-bold text-primary" data-testid="text-score">
            {score}/{total}
          </div>
          <p className="mt-2 text-lg text-muted-foreground">
            {percentage.toFixed(0)}% correct
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            className="gap-2"
            data-testid="button-retry"
          >
            <RotateCcw className="h-4 w-4" />
            Retry Quiz
          </Button>
          <Button
            variant="outline"
            onClick={onHome}
            className="gap-2"
            data-testid="button-choose-topic"
          >
            <Home className="h-4 w-4" />
            Choose New Topic
          </Button>
        </div>
      </div>
    </Card>
  );
}
