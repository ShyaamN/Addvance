import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { auth } from "@/lib/auth";
import { mockTopics } from "@/data/quizData";
import type { Topic, Question } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  BookOpen
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questionForm, setQuestionForm] = useState<Partial<Question>>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    auth.logout();
    setLocation("/");
  };

  const handleSaveQuestion = () => {
    if (!selectedTopic || !questionForm.question) return;

    const newQuestion: Question = {
      id: editingQuestion?.id || `q${Date.now()}`,
      question: questionForm.question,
      options: questionForm.options as string[],
      correctAnswer: questionForm.correctAnswer || 0,
      explanation: questionForm.explanation || "",
    };

    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === selectedTopic.id) {
          if (editingQuestion) {
            return {
              ...topic,
              questions: topic.questions.map(q =>
                q.id === editingQuestion.id ? newQuestion : q
              ),
            };
          } else {
            return {
              ...topic,
              questions: [...topic.questions, newQuestion],
            };
          }
        }
        return topic;
      })
    );

    resetForm();
  };

  const handleDeleteQuestion = (topicId: string, questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            questions: topic.questions.filter(q => q.id !== questionId),
          };
        }
        return topic;
      })
    );
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm(question);
    setIsAddingQuestion(true);
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setIsAddingQuestion(false);
    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(questionForm.options || ["", "", "", ""])];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  if (!auth.isAuthenticated()) {
    return null;
  }

  const user = auth.getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Manage questions and content • {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation("/")}>
                <BookOpen className="h-4 w-4 mr-2" />
                Back to App
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="questions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="questions">Manage Questions</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Topics List */}
                <Card className="p-6 lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Topics</h3>
                  <div className="space-y-2">
                    {topics.map(topic => (
                      <Card
                        key={topic.id}
                        className={`p-3 cursor-pointer transition-all ${
                          selectedTopic?.id === topic.id
                            ? 'border-2 border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setSelectedTopic(topic);
                          resetForm();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{topic.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Year {topic.yearLevel} • {topic.questions.length} questions
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>

                {/* Questions Management */}
                <Card className="p-6 lg:col-span-2">
                  {selectedTopic ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedTopic.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedTopic.questions.length} questions
                          </p>
                        </div>
                        <Button
                          onClick={() => setIsAddingQuestion(true)}
                          disabled={isAddingQuestion}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>

                      {/* Add/Edit Question Form */}
                      {isAddingQuestion && (
                        <Card className="p-4 border-2 border-primary">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">
                                {editingQuestion ? 'Edit Question' : 'New Question'}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetForm}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Textarea
                                value={questionForm.question}
                                onChange={(e) =>
                                  setQuestionForm({ ...questionForm, question: e.target.value })
                                }
                                placeholder="Enter the question..."
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Options</Label>
                              {[0, 1, 2, 3].map(index => (
                                <div key={index} className="flex gap-2 items-center">
                                  <Input
                                    value={questionForm.options?.[index] || ""}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                  />
                                  <Button
                                    variant={
                                      questionForm.correctAnswer === index
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      setQuestionForm({ ...questionForm, correctAnswer: index })
                                    }
                                  >
                                    {questionForm.correctAnswer === index ? '✓' : 'Set Correct'}
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <Label>Explanation</Label>
                              <Textarea
                                value={questionForm.explanation}
                                onChange={(e) =>
                                  setQuestionForm({ ...questionForm, explanation: e.target.value })
                                }
                                placeholder="Explain the answer..."
                                rows={2}
                              />
                            </div>

                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={resetForm}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveQuestion}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Question
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Questions List */}
                      <div className="space-y-3">
                        {selectedTopic.questions.map((question, index) => (
                          <Card key={question.id} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary">Q{index + 1}</Badge>
                                  </div>
                                  <p className="font-medium">{question.question}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditQuestion(question)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteQuestion(selectedTopic.id, question.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-1 text-sm">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded ${
                                      question.correctAnswer === optIndex
                                        ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                        : 'bg-muted/30'
                                    }`}
                                  >
                                    {option}
                                    {question.correctAnswer === optIndex && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Correct
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <p className="text-sm text-muted-foreground">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Select a topic to manage questions
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">System Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-primary/5">
                    <p className="text-sm text-muted-foreground">Total Topics</p>
                    <p className="text-3xl font-bold">{topics.length}</p>
                  </Card>
                  <Card className="p-4 bg-primary/5">
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="text-3xl font-bold">
                      {topics.reduce((sum, t) => sum + t.questions.length, 0)}
                    </p>
                  </Card>
                  <Card className="p-4 bg-primary/5">
                    <p className="text-sm text-muted-foreground">Year Levels</p>
                    <p className="text-3xl font-bold">
                      {new Set(topics.map(t => t.yearLevel)).size}
                    </p>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
