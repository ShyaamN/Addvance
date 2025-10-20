import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  timeRemaining: number;
}

export default function Timer({ timeRemaining }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLow = timeRemaining < 120;
  const isCritical = timeRemaining < 30;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 font-semibold transition-colors",
        isCritical && "animate-pulse bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        isLow && !isCritical && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        !isLow && "bg-muted text-foreground"
      )}
      data-testid="timer"
    >
      <Clock className="h-4 w-4" />
      <span>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
