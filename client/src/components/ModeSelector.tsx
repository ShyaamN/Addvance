import { Card } from "@/components/ui/card";
import { Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  selected: 'quiz' | 'study';
  onChange: (mode: 'quiz' | 'study') => void;
}

export default function ModeSelector({ selected, onChange }: ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">Select Mode</h3>
      <div className="grid grid-cols-2 gap-3">
        <Card
          className={cn(
            "p-4 cursor-pointer transition-all hover-elevate active-elevate-2",
            selected === 'quiz' && "border-primary bg-primary/5"
          )}
          onClick={() => onChange('quiz')}
          data-testid="mode-quiz"
        >
          <div className="space-y-2">
            <Clock className={cn("h-6 w-6", selected === 'quiz' ? "text-primary" : "text-muted-foreground")} />
            <div>
              <h4 className="font-semibold">Quiz Mode</h4>
              <p className="text-sm text-muted-foreground mt-1">Timed, scored</p>
            </div>
          </div>
        </Card>

        <Card
          className={cn(
            "p-4 cursor-pointer transition-all hover-elevate active-elevate-2",
            selected === 'study' && "border-primary bg-primary/5"
          )}
          onClick={() => onChange('study')}
          data-testid="mode-study"
        >
          <div className="space-y-2">
            <BookOpen className={cn("h-6 w-6", selected === 'study' ? "text-primary" : "text-muted-foreground")} />
            <div>
              <h4 className="font-semibold">Study Mode</h4>
              <p className="text-sm text-muted-foreground mt-1">Untimed practice</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
