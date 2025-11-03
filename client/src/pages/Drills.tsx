import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Play, Download, Printer } from "lucide-react";

// Topic-based drill question generators
const drillTopics = {
  fractions: {
    name: "Fractions",
    icon: "➗",
    generators: [
      () => ({ q: `3/4 of 8 =`, a: "6" }),
      () => ({ q: `2/3 + 1/4 =`, a: "11/12" }),
      () => ({ q: `Simplify fully: 45/60 =`, a: "3/4" }),
      () => ({ q: `1/2 × 3/4 =`, a: "3/8" }),
      () => ({ q: `5/6 - 1/3 =`, a: "1/2" }),
      () => ({ q: `3/5 ÷ 2/3 =`, a: "9/10" }),
      () => ({ q: `Convert 0.75 to fraction =`, a: "3/4" }),
      () => ({ q: `2 1/4 as improper fraction =`, a: "9/4" }),
    ]
  },
  powers: {
    name: "Powers & Roots",
    icon: "²",
    generators: [
      () => ({ q: `4² =`, a: "16" }),
      () => ({ q: `4³ =`, a: "64" }),
      () => ({ q: `1⁷ =`, a: "1" }),
      () => ({ q: `0.5² =`, a: "0.25" }),
      () => ({ q: `5² =`, a: "25" }),
      () => ({ q: `2⁵ =`, a: "32" }),
      () => ({ q: `√49 =`, a: "7" }),
      () => ({ q: `√144 =`, a: "12" }),
      () => ({ q: `10³ =`, a: "1000" }),
    ]
  },
  decimals: {
    name: "Decimals",
    icon: "•",
    generators: [
      () => ({ q: `1.43 - 0.78 =`, a: "0.65" }),
      () => ({ q: `3.4 × 5 =`, a: "17" }),
      () => ({ q: `2.5 + 1.75 =`, a: "4.25" }),
      () => ({ q: `8.4 ÷ 2 =`, a: "4.2" }),
      () => ({ q: `0.6 × 0.5 =`, a: "0.3" }),
      () => ({ q: `12.8 - 7.9 =`, a: "4.9" }),
      () => ({ q: `0.25 × 4 =`, a: "1" }),
    ]
  },
  percentages: {
    name: "Percentages",
    icon: "%",
    generators: [
      () => ({ q: `20% of 80 =`, a: "16" }),
      () => ({ q: `50% of 64 =`, a: "32" }),
      () => ({ q: `10% of 150 =`, a: "15" }),
      () => ({ q: `25% of 200 =`, a: "50" }),
      () => ({ q: `75% of 40 =`, a: "30" }),
      () => ({ q: `5% of 100 =`, a: "5" }),
    ]
  },
  algebra: {
    name: "Basic Algebra",
    icon: "x",
    generators: [
      () => ({ q: `A=2, B=5. B²-3A =`, a: "19" }),
      () => ({ q: `x=3. 2x + 5 =`, a: "11" }),
      () => ({ q: `y=4. 3y - 7 =`, a: "5" }),
      () => ({ q: `a=6. a/2 + 4 =`, a: "7" }),
      () => ({ q: `x=5. x² - 10 =`, a: "15" }),
    ]
  },
  arithmetic: {
    name: "Mental Arithmetic",
    icon: "±",
    generators: [
      () => ({ q: `15 × 8 =`, a: "120" }),
      () => ({ q: `144 ÷ 12 =`, a: "12" }),
      () => ({ q: `27 + 38 =`, a: "65" }),
      () => ({ q: `93 - 47 =`, a: "46" }),
      () => ({ q: `25 × 4 =`, a: "100" }),
      () => ({ q: `180 ÷ 15 =`, a: "12" }),
    ]
  }
};

export default function Drills() {
  const [, setLocation] = useLocation();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Array<{q: string, a: string}>>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStartDrills = () => {
    if (selectedTopics.length === 0) return;
    generateQuestions();
    setStarted(true);
  };

  const generateQuestions = () => {
    const allGenerators: Array<() => {q: string, a: string}> = [];
    
    selectedTopics.forEach(topicId => {
      const topic = drillTopics[topicId as keyof typeof drillTopics];
      if (topic) {
        allGenerators.push(...topic.generators);
      }
    });

    // Shuffle and select 10 questions
    const shuffled = allGenerators.sort(() => Math.random() - 0.5);
    const newQuestions = shuffled.slice(0, 10).map(gen => gen());
    setQuestions(newQuestions);
    setShowAnswers(false);
  };

  const handleRegenerate = () => {
    generateQuestions();
  };

  const handleBackToTopics = () => {
    setStarted(false);
    setShowAnswers(false);
  };

  const handlePrintQuestionsOnly = () => {
    const originalShowAnswers = showAnswers;
    setShowAnswers(false);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowAnswers(originalShowAnswers), 100);
    }, 100);
  };

  const handlePrintWithAnswers = () => {
    const originalShowAnswers = showAnswers;
    setShowAnswers(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowAnswers(originalShowAnswers), 100);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {!started ? (
            // Topic Selection View
            <>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocation("/")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-serif">Numeracy Drills</h1>
                  <p className="text-muted-foreground mt-1">Select topics to practice</p>
                </div>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Select Topics ({selectedTopics.length} selected)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(drillTopics).map(([id, topic]) => (
                    <Card
                      key={id}
                      className="p-4 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => toggleTopic(id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedTopics.includes(id)}
                          onCheckedChange={() => toggleTopic(id)}
                        />
                        <Label className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                          <span className="text-2xl">{topic.icon}</span>
                          {topic.name}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {topic.generators.length} drills
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleStartDrills}
                  disabled={selectedTopics.length === 0}
                  className="w-full sm:w-auto"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Drills ({selectedTopics.length} {selectedTopics.length === 1 ? 'topic' : 'topics'})
                </Button>
              </div>
            </>
          ) : (
            // Drills Grid View
            <>
              {/* Header - hidden when printing */}
              <div className="flex items-center gap-4 print:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToTopics}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-serif">Numeracy Drills</h1>
                  <p className="text-muted-foreground mt-1">
                    {selectedTopics.map(id => drillTopics[id as keyof typeof drillTopics].name).join(', ')}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
                    {showAnswers ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Answers
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Answers
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handlePrintQuestionsOnly}>
                    <Printer className="h-4 w-4 mr-2" />
                    Questions Only
                  </Button>
                  <Button variant="outline" onClick={handlePrintWithAnswers}>
                    <Download className="h-4 w-4 mr-2" />
                    With Answers
                  </Button>
                  <Button onClick={handleRegenerate}>Regenerate</Button>
                </div>
              </div>

              {/* Print header - visible only when printing */}
              <div className="hidden print:block text-center mb-8">
                <h1 className="text-2xl font-bold">Numeracy Drills</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Topics: {selectedTopics.map(id => drillTopics[id as keyof typeof drillTopics].name).join(', ')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-card rounded-lg shadow-lg p-6">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 min-h-[120px] flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-950/40 transition-all hover:shadow-md"
                  >
                    <div className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-300 font-sans">{i + 1}</div>
                    <div className="text-xl font-sans text-foreground dark:text-foreground text-center mb-2">{q.q}</div>
                    {showAnswers && (
                      <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800 w-full text-center">
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {q.a}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
