import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DifficultySelectorProps {
  selected: 'foundation' | 'higher';
  onChange: (difficulty: 'foundation' | 'higher') => void;
}

export default function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">Select Difficulty</h3>
      <div className="grid grid-cols-2 gap-3">
        <Card
          className={cn(
            "p-4 cursor-pointer transition-all hover-elevate active-elevate-2",
            selected === 'foundation' && "border-primary bg-primary/5"
          )}
          onClick={() => onChange('foundation')}
          data-testid="difficulty-foundation"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Foundation</h4>
              <p className="text-sm text-muted-foreground mt-1">Grades 1-5</p>
            </div>
            {selected === 'foundation' && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        </Card>

        <Card
          className={cn(
            "p-4 cursor-pointer transition-all hover-elevate active-elevate-2",
            selected === 'higher' && "border-primary bg-primary/5"
          )}
          onClick={() => onChange('higher')}
          data-testid="difficulty-higher"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Higher</h4>
              <p className="text-sm text-muted-foreground mt-1">Grades 4-9</p>
            </div>
            {selected === 'higher' && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
