import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-semibold" data-testid="text-progress">
          {current}/{total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" data-testid="progress-bar" />
    </div>
  );
}
