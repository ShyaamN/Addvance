import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  size?: 'sm' | 'md';
}

export default function AchievementBadge({
  icon,
  name,
  description,
  unlocked,
  size = 'md'
}: AchievementBadgeProps) {
  return (
    <Card
      className={cn(
        "p-4 transition-all",
        unlocked ? "border-primary/50 bg-primary/5" : "opacity-50",
        size === 'sm' && "p-3"
      )}
      data-testid={`achievement-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center rounded-full bg-muted",
          size === 'md' ? "h-12 w-12 text-2xl" : "h-10 w-10 text-xl",
          unlocked && "bg-primary/10"
        )}>
          {unlocked ? icon : '🔒'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold truncate", size === 'sm' && "text-sm")}>{name}</h4>
          <p className={cn("text-muted-foreground truncate", size === 'sm' ? "text-xs" : "text-sm")}>
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
