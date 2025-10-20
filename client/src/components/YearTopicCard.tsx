import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface YearTopicCardProps {
  yearLevel: number;
  topicCount: number;
  gradeLevel: string;
  onClick: () => void;
}

export default function YearTopicCard({
  yearLevel,
  topicCount,
  gradeLevel,
  onClick
}: YearTopicCardProps) {
  return (
    <Card
      className="p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-year-${yearLevel}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold font-serif text-primary">
              Year {yearLevel}
            </h3>
            <Badge variant="secondary" data-testid={`badge-grade-${yearLevel}`}>
              {gradeLevel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {topicCount} topics available
          </p>
        </div>
        <ChevronRight className="h-6 w-6 text-muted-foreground" />
      </div>
    </Card>
  );
}
