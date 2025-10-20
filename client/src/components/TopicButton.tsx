import { Button } from "@/components/ui/button";
import { Circle, Triangle, BarChart3, Percent, Divide, TrendingUp } from "lucide-react";

interface TopicButtonProps {
  name: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

const iconMap: Record<string, any> = {
  circle: Circle,
  triangle: Triangle,
  barchart: BarChart3,
  percent: Percent,
  divide: Divide,
  trending: TrendingUp,
};

export default function TopicButton({
  name,
  icon,
  isSelected,
  onClick
}: TopicButtonProps) {
  const IconComponent = iconMap[icon] || Circle;

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className="w-full justify-start gap-2"
      onClick={onClick}
      data-testid={`button-topic-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <IconComponent className="h-4 w-4" />
      <span className="flex-1 text-left">{name}</span>
    </Button>
  );
}
