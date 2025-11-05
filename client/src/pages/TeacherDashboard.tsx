import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { mockTopics } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DifficultySelector from "@/components/DifficultySelector";
import { ArrowLeft, BookOpen, GraduationCap, FileText, Download, Eye, EyeOff, Sparkles, Maximize, Minimize } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MathText from "@/components/MathText";

interface GeneratedQuestion {
  topicName: string;
  topicIcon: string;
  question: string;
  answer: string;
  explanation: string;
}

type DashboardMode = 'worksheet' | 'starter';

export default function TeacherDashboard() {
  const [, setLocation] = useLocation();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [starterCount, setStarterCount] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<'foundation' | 'higher'>('foundation');
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showAnswers, setShowAnswers] = useState(true);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<DashboardMode>('worksheet');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleGenerateWorksheet = () => {
    if (selectedTopics.length === 0) return;

    // Get all questions from selected topics
    const allQuestions: GeneratedQuestion[] = [];
    
    selectedTopics.forEach(topicId => {
      const topic = mockTopics.find(t => t.id === topicId);
      if (topic) {
        topic.questions.forEach(q => {
          allQuestions.push({
            topicName: topic.name,
            topicIcon: topic.icon,
            question: q.question,
            answer: q.options[q.correctAnswer],
            explanation: q.explanation
          });
        });
      }
    });

    // Shuffle and take the requested number of questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const count = mode === 'starter' ? starterCount : questionCount;
    const selected = shuffled.slice(0, Math.min(count, allQuestions.length));
    
    setGeneratedQuestions(selected);
    setIsGenerated(true);
    setRevealedAnswers(new Set());
  };

  const toggleRevealAnswer = (index: number) => {
    setRevealedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const revealAllAnswers = () => {
    setRevealedAnswers(new Set(generatedQuestions.map((_, i) => i)));
  };

  const hideAllAnswers = () => {
    setRevealedAnswers(new Set());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Topic', 'Question', 'Answer', 'Explanation'];
    const rows = generatedQuestions.map((q, index) => [
      index + 1,
      q.topicName,
      q.question,
      q.answer,
      q.explanation
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worksheet-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const groupedTopics = mockTopics.reduce((acc, topic) => {
    const year = `Year ${topic.yearLevel}`;
    if (!acc[year]) acc[year] = [];
    acc[year].push(topic);
    return acc;
  }, {} as Record<string, typeof mockTopics>);

  if (isGenerated) {
    // Classroom Starters Mode - Grid Layout
    if (mode === 'starter') {
      return (
        <div className={`bg-background ${isFullscreen ? 'classroom-starters-fullscreen' : 'min-h-screen'}`}>
          <div className={`flex flex-col ${isFullscreen ? 'h-screen p-6 box-border' : 'container mx-auto px-4 py-8 max-w-6xl'}`}>
            {/* Header ribbon - hidden in fullscreen */}
            <div className={`flex items-center justify-between flex-shrink-0 ${isFullscreen ? 'hidden' : 'mb-6'}`}>
              {/* Left side - Title */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsGenerated(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold font-serif">Classroom Starters</h1>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {generatedQuestions.length} starter questions • {difficulty === 'foundation' ? 'Foundation' : 'Higher'} Tier
                  </p>
                </div>
              </div>

              {/* Right side - Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                      setIsFullscreen(false);
                    } else {
                      document.documentElement.requestFullscreen();
                      setIsFullscreen(true);
                    }
                  }}
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
                <Button variant="outline" onClick={hideAllAnswers}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide All
                </Button>
                <Button variant="outline" onClick={revealAllAnswers}>
                  <Eye className="h-4 w-4 mr-2" />
                  Reveal All
                </Button>
              </div>
            </div>

            {/* Grid Layout for Starters - takes remaining height */}
            <div className={`grid gap-6 ${
              isFullscreen 
                ? 'grid-cols-2 auto-rows-fr' // Always 2 columns in fullscreen with equal row heights
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'
            }`}
            style={isFullscreen ? { height: 'calc(100vh - 3rem - 3rem)' } : undefined}>
                {generatedQuestions.map((q, index) => (
                  <div key={index} className={`relative ${isFullscreen ? 'h-full' : 'min-h-[300px]'}`} style={{ perspective: '1000px' }}>
                    <div 
                      className={`relative w-full h-full transition-transform duration-700`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: revealedAnswers.has(index) ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Front of card - Question */}
                      <Card className={`absolute inset-0 space-y-4 transition-shadow flex flex-col ${
                        isFullscreen ? 'h-full p-8' : 'p-6 hover:shadow-lg'
                      }`}
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}>
                        {/* Question Header with Show Answer button */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold ${
                              isFullscreen ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-lg'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <span className={`font-semibold text-muted-foreground uppercase tracking-wide ${
                                isFullscreen ? 'text-xl' : 'text-xs'
                              }`}>
                                {q.topicName}
                              </span>
                            </div>
                          </div>
                          
                          <Button
                            variant="default"
                            size={isFullscreen ? "lg" : "sm"}
                            onClick={() => toggleRevealAnswer(index)}
                            className={isFullscreen ? 'text-xl px-6 py-3' : ''}
                          >
                            <Eye className={`${isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} mr-2`} />
                            Show Answer
                          </Button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <div className={`bg-muted/30 rounded-lg ${isFullscreen ? 'p-8' : 'p-4'}`}>
                            <h3 className={`font-semibold leading-relaxed question-text ${
                              isFullscreen ? 'text-4xl' : 'text-xl'
                            }`}>
                              <MathText>{q.question}</MathText>
                            </h3>
                          </div>
                        </div>
                      </Card>

                      {/* Back of card - Answer */}
                      <Card className={`absolute inset-0 space-y-4 transition-shadow flex flex-col ${
                        isFullscreen ? 'h-full p-8' : 'p-6 hover:shadow-lg'
                      } bg-primary/5 border-2 border-primary/20`}
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}>
                        {/* Answer Header with Show Question button */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold ${
                              isFullscreen ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-lg'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <span className={`font-semibold text-muted-foreground uppercase tracking-wide ${
                                isFullscreen ? 'text-xl' : 'text-xs'
                              }`}>
                                {q.topicName}
                              </span>
                            </div>
                          </div>
                          
                          <Button
                            variant="secondary"
                            size={isFullscreen ? "lg" : "sm"}
                            onClick={() => toggleRevealAnswer(index)}
                            className={isFullscreen ? 'text-xl px-6 py-3' : ''}
                          >
                            <EyeOff className={`${isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} mr-2`} />
                            Show Question
                          </Button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-4">
                          <div>
                            <p className={`font-semibold text-primary mb-2 ${
                              isFullscreen ? 'text-2xl' : 'text-sm'
                            }`}>Answer:</p>
                            <p className={`font-medium answer-text ${
                              isFullscreen ? 'text-4xl' : 'text-lg'
                            }`}>
                              <MathText>{q.answer}</MathText>
                            </p>
                          </div>
                          
                          {!isFullscreen && (
                            <>
                              <Separator />
                              
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-2">Explanation:</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  <MathText>{q.explanation}</MathText>
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      );
    }

    // Worksheet Mode - List Layout
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header - hidden when printing */}
            <div className="flex items-center justify-between print:hidden">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsGenerated(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold font-serif">Generated Worksheet</h1>
                  <p className="text-muted-foreground mt-1">
                    {generatedQuestions.length} questions • {difficulty === 'foundation' ? 'Foundation' : 'Higher'} Tier
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2 mr-4">
                  <Switch
                    id="show-answers"
                    checked={showAnswers}
                    onCheckedChange={setShowAnswers}
                  />
                  <Label htmlFor="show-answers" className="cursor-pointer">
                    Show Answers
                  </Label>
                </div>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={handlePrint}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            {/* Printable worksheet */}
            <div className="space-y-8">
              {/* Print header */}
              <div className="hidden print:block text-center mb-8">
                <h1 className="text-3xl font-bold">Addvance Maths Worksheet</h1>
                <p className="text-muted-foreground mt-2">
                  {difficulty === 'foundation' ? 'Foundation' : 'Higher'} Tier • {generatedQuestions.length} Questions
                </p>
                <Separator className="my-4" />
              </div>

              {generatedQuestions.map((q, index) => (
                <Card key={index} className="p-6 space-y-4 page-break-inside-avoid">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {q.topicName}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold">
                          <MathText>{q.question}</MathText>
                        </h3>
                      </div>

                      {showAnswers && (
                        <>
                          <Separator />

                          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                            <div>
                              <p className="text-sm font-semibold text-primary mb-1">Answer:</p>
                              <p className="text-base font-medium">{q.answer}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-semibold text-muted-foreground mb-1">Explanation:</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .print\\:hidden { display: none !important; }
            .print\\:block { display: block !important; }
            .page-break-inside-avoid { page-break-inside: avoid; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-serif">Teacher Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Create custom worksheets with questions and answers
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="grid gap-6">
            {/* Mode Selection */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Select Mode</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    mode === 'worksheet'
                      ? 'border-2 border-primary bg-primary/5'
                      : 'border hover:border-primary/50'
                  }`}
                  onClick={() => setMode('worksheet')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Worksheet Generator</h4>
                      <p className="text-sm text-muted-foreground">
                        Create printable worksheets with multiple questions
                      </p>
                    </div>
                  </div>
                </Card>
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    mode === 'starter'
                      ? 'border-2 border-primary bg-primary/5'
                      : 'border hover:border-primary/50'
                  }`}
                  onClick={() => setMode('starter')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Classroom Starters</h4>
                      <p className="text-sm text-muted-foreground">
                        Display 1-4 questions with individual reveal buttons
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  {mode === 'starter' ? 'Starter Settings' : 'Worksheet Settings'}
                </h3>
              </div>
              <div className="space-y-4">
                {mode === 'starter' ? (
                  <div>
                    <Label htmlFor="starter-count" className="text-sm font-medium mb-2 block">
                      Number of Starter Questions
                    </Label>
                    <div className="grid grid-cols-4 gap-2 max-w-md">
                      {[1, 2, 3, 4].map((count) => (
                        <Button
                          key={count}
                          variant={starterCount === count ? "default" : "outline"}
                          onClick={() => setStarterCount(count)}
                          className="w-full"
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select 1 to 4 questions for your classroom starter
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="question-count" className="text-sm font-medium mb-2 block">
                      Number of Questions
                    </Label>
                    <Input
                      id="question-count"
                      type="number"
                      min={1}
                      max={50}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                      className="max-w-xs"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Choose between 1 and 50 questions
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <DifficultySelector
              selected={difficulty}
              onChange={setDifficulty}
            />
          </div>

          {/* Topic Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Select Topics ({selectedTopics.length} selected)
            </h3>
            <div className="space-y-6">
              {Object.entries(groupedTopics).map(([year, topics]) => (
                <div key={year}>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">{year}</h4>
                  <div className="grid gap-3">
                    {topics.map((topic) => (
                      <Card
                        key={topic.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => toggleTopic(topic.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedTopics.includes(topic.id)}
                            onCheckedChange={() => toggleTopic(topic.id)}
                          />
                          <Label className="flex-1 cursor-pointer font-medium">
                            {topic.icon} {topic.name}
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {topic.questions.length} questions available
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleGenerateWorksheet}
              disabled={selectedTopics.length === 0}
              className="w-full sm:w-auto"
            >
              {mode === 'starter' ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Starters ({selectedTopics.length} {selectedTopics.length === 1 ? 'topic' : 'topics'})
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Generate Worksheet ({selectedTopics.length} {selectedTopics.length === 1 ? 'topic' : 'topics'})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
