import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DesmosGraph } from "./DesmosGraph";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  imageUrl?: string;
  graphExpression?: string;
  answer?: string;
  explanation?: string;
  showFlipButton?: boolean;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  imageUrl,
  graphExpression,
  answer,
  explanation,
  showFlipButton = false
}: QuestionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flip-card-container">
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of card - Question */}
        <Card className="flip-card-face flip-card-front p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="default" data-testid="badge-question-number">
                Question {questionNumber} of {totalQuestions}
              </Badge>
              {showFlipButton && answer && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Show Answer
                </Button>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold leading-relaxed" data-testid="text-question">
              {question}
            </h2>
            
            {/* Image Display */}
            {imageUrl && (
              <div className="flex justify-center">
                <img 
                  src={imageUrl} 
                  alt="Question illustration" 
                  className="max-w-full h-auto rounded border"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}

            {/* Desmos Graph Display */}
            {graphExpression && (
              <div className="flex justify-center">
                <DesmosGraph 
                  expression={graphExpression} 
                  width={500}
                  height={350}
                />
              </div>
            )}
          </div>
        </Card>

        {/* Back of card - Answer */}
        {showFlipButton && answer && (
          <Card className="flip-card-face flip-card-back p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" data-testid="badge-answer">
                  Answer
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="gap-2"
                >
                  <EyeOff className="h-4 w-4" />
                  Show Question
                </Button>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Correct Answer:
                  </h3>
                  <p className="text-xl font-medium text-green-800 dark:text-green-200">
                    {answer}
                  </p>
                </div>
                
                {explanation && (
                  <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-500 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Explanation:
                    </h3>
                    <p className="text-base text-blue-800 dark:text-blue-200 leading-relaxed">
                      {explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Flip animation styles */}
      <style>{`
        .flip-card-container {
          perspective: 1000px;
          width: 100%;
        }

        .flip-card {
          position: relative;
          width: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-face {
          width: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flip-card-front {
          position: relative;
          z-index: 2;
        }

        .flip-card-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
