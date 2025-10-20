import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  option: string;
  label: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function AnswerOption({
  option,
  label,
  isSelected,
  isCorrect = false,
  isIncorrect = false,
  disabled = false,
  onClick
}: AnswerOptionProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover-elevate active-elevate-2",
        isSelected && !isCorrect && !isIncorrect && "border-primary bg-primary/5",
        isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20",
        isIncorrect && "border-red-500 bg-red-50 dark:bg-red-900/20",
        disabled && "cursor-not-allowed opacity-75"
      )}
      onClick={disabled ? undefined : onClick}
      data-testid={`option-${label}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold",
              isSelected && !isCorrect && !isIncorrect && "border-primary bg-primary/10 text-primary",
              isCorrect && "border-green-500 bg-green-500 text-white",
              isIncorrect && "border-red-500 bg-red-500 text-white",
              !isSelected && !isCorrect && !isIncorrect && "border-border"
            )}
          >
            {isCorrect ? (
              <Check className="h-5 w-5" />
            ) : isIncorrect ? (
              <X className="h-5 w-5" />
            ) : (
              label
            )}
          </div>
          <span className="text-base sm:text-lg">{option}</span>
        </div>
      </div>
    </Card>
  );
}
