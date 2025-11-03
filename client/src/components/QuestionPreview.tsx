import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DesmosGraph } from "./DesmosGraph";
import { Check, X } from "lucide-react";
import type { Question } from "@shared/schema";

interface QuestionPreviewProps {
  question: Partial<Question>;
  onConfirm: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function QuestionPreview({ question, onConfirm, onCancel, isEditing = false }: QuestionPreviewProps) {
  return (
    <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>📝</span>
            Preview {isEditing ? '(Editing)' : '(New Question)'}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onConfirm} size="sm">
              <Check className="h-4 w-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Add Question'}
            </Button>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="space-y-4">
            {/* Question Text */}
            <div>
              <p className="font-medium text-lg">{question.question || "(No question text)"}</p>
            </div>

            {/* Image Display */}
            {question.imageUrl && (
              <div className="my-4">
                <img 
                  src={question.imageUrl} 
                  alt="Question illustration" 
                  className="max-w-full h-auto rounded border"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {/* Desmos Graph Display */}
            {question.graphExpression && (
              <div className="my-4">
                <Badge variant="secondary" className="mb-2">
                  📊 Interactive Graph
                </Badge>
                <DesmosGraph 
                  expression={question.graphExpression} 
                  width={400}
                  height={300}
                />
                <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                  {question.graphExpression.split(/[;\n]/).map((expr, i) => (
                    <div key={i}>{expr.trim()}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-2">
              {question.options?.map((option, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 ${
                    idx === question.correctAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{option || "(Empty option)"}</span>
                    {idx === question.correctAnswer && (
                      <Badge variant="default" className="ml-auto">
                        ✓ Correct Answer
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            {question.explanation && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Explanation:</p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
