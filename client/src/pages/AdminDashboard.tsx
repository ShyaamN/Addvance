import { useState, useEffect } from "react";
import Papa from "papaparse";

/**
 * Admin Dashboard - Enhanced Question Management System
 * 
 * Features:
 * 1. PREVIEW MODE - Review questions before saving to database
 *    - Click "Preview" button to see how the question will appear
 *    - Edit or confirm before final save
 * 
 * 2. IMAGE UPLOAD - Add graphs, diagrams, and visual aids
 *    - Upload images (JPG, PNG, etc.) for questions
 *    - Images are converted to base64 and stored with the question
 *    - Remove uploaded images before saving if needed
 * 
 * 3. DESMOS GRAPH INTEGRATION - Interactive mathematical graphs
 *    - Enter LaTeX expressions (e.g., y=x^2, y=\sin(x))
 *    - Separate multiple expressions with semicolons
 *    - Graphs render using Desmos API v1.11
 *    - Examples: y=x^2; y=2x+1 or x^2+y^2=25
 * 
 * 4. CSV BULK UPLOAD - Import multiple questions at once
 *    - Format: Question, Option1 (correct), Option2, Option3, Option4
 * 
 * Usage:
 * - Login: test@gmail.com / 123
 * - Select a topic from the left sidebar
 * - Click "Add Question" to create new questions
 * - Use "Preview" to review before saving
 * - Questions with images/graphs show badges in the list
 */

// Helper to add uploaded questions to a topic (or create a new topic)
function addUploadedQuestionsToTopics(
  parsedRows: any[],
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>,
  targetTopicId: string,
  newTopicName: string
) {
  // Each row: [question, option1 (correct), option2, option3, option4]
  const newQuestions = parsedRows
    .filter(row => row.length >= 5 && row[0] && row[1])
    .map((row, idx) => ({
      id: `uploaded-${Date.now()}-${idx}`,
      question: row[0],
      options: [row[1], row[2], row[3], row[4]],
      correctAnswer: 0,
      explanation: "Uploaded by admin."
    }));
  if (newQuestions.length === 0) return;
  setTopics((prev: Topic[]) => {
    if (targetTopicId === "__new__" && newTopicName) {
      // Create new topic
      return [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          name: newTopicName,
          icon: "📄",
          yearLevel: 11,
          questions: newQuestions
        }
      ];
    } else {
      // Add to existing topic
      return prev.map((t: Topic) => t.id === targetTopicId
        ? { ...t, questions: [...t.questions, ...newQuestions] }
        : t
      );
    }
  });
}
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
  BookOpen,
  Upload,
  Image as ImageIcon,
  Eye
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
import { QuestionPreview } from "@/components/QuestionPreview";
import { DesmosInput } from "@/components/DesmosInput";
import { DesmosGraph } from "@/components/DesmosGraph";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvTargetTopic, setCsvTargetTopic] = useState<string>("");
  const [newTopicName, setNewTopicName] = useState<string>("");
  // CSV upload handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!csvTargetTopic) {
      setCsvError("Please select a topic or create a new one.");
      return;
    }
    if (csvTargetTopic === "__new__" && !newTopicName.trim()) {
      setCsvError("Please enter a name for the new topic.");
      return;
    }
    Papa.parse(file, {
      complete: (results: Papa.ParseResult<any>) => {
        if (!results.data || results.errors.length) {
          setCsvError("Error parsing CSV file.");
          return;
        }
        addUploadedQuestionsToTopics(results.data, setTopics, csvTargetTopic, newTopicName.trim());
        setNewTopicName("");
        setCsvTargetTopic("");
      },
      error: () => setCsvError("Error reading CSV file."),
    });
  };
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [questionForm, setQuestionForm] = useState<Partial<Question>>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    imageUrl: "",
    graphExpression: "",
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
      imageUrl: questionForm.imageUrl,
      graphExpression: questionForm.graphExpression,
    };

    setTopics(prevTopics => {
      const updatedTopics = prevTopics.map(topic => {
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
      });

      // Update the selected topic to reflect changes immediately
      const updatedSelectedTopic = updatedTopics.find(t => t.id === selectedTopic.id);
      if (updatedSelectedTopic) {
        setSelectedTopic(updatedSelectedTopic);
      }

      return updatedTopics;
    });

    setShowPreview(false);
    resetForm();
  };

  const handleDeleteQuestion = (topicId: string, questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    setTopics(prevTopics => {
      const updated = prevTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            questions: topic.questions.filter(q => q.id !== questionId),
          };
        }
        return topic;
      });
      // If the currently selected topic is affected, update it
      if (selectedTopic && selectedTopic.id === topicId) {
        const updatedTopic = updated.find(t => t.id === topicId) || null;
        setSelectedTopic(updatedTopic);
      }
      return updated;
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm(question);
    setIsAddingQuestion(true);
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setIsAddingQuestion(false);
    setShowPreview(false);
    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      imageUrl: "",
      graphExpression: "",
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(questionForm.options || ["", "", "", ""])];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setQuestionForm({ ...questionForm, imageUrl });
    };
    reader.readAsDataURL(file);
  };

  const handlePreview = () => {
    if (!questionForm.question || !questionForm.options?.every(opt => opt.trim())) {
      alert("Please fill in the question and all options before previewing.");
      return;
    }
    setShowPreview(true);
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
                  Manage questions and content • {user?.username}
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

          {/* CSV Upload */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Upload Questions (CSV)</h3>
            <div className="flex flex-col gap-2 mb-2">
              <Label>Select topic to add questions to:</Label>
              <select
                className="border rounded px-2 py-1 bg-background text-foreground"
                style={{ backgroundColor: '#181f2a', color: '#fff' }}
                value={csvTargetTopic}
                onChange={e => setCsvTargetTopic(e.target.value)}
              >
                <option value="" style={{ backgroundColor: '#181f2a', color: '#fff' }}>-- Select Topic --</option>
                {topics.map(t => (
                  <option key={t.id} value={t.id} style={{ backgroundColor: '#181f2a', color: '#fff' }}>{t.name}</option>
                ))}
                <option value="__new__" style={{ backgroundColor: '#181f2a', color: '#fff' }}>Create New Topic...</option>
              </select>
              {csvTargetTopic === "__new__" && (
                <Input
                  type="text"
                  placeholder="New topic name"
                  value={newTopicName}
                  onChange={e => setNewTopicName(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
            <Input type="file" accept=".csv" onChange={handleCSVUpload} />
            <p className="text-xs text-muted-foreground mt-1">Format: Question, Option1 (correct), Option2, Option3, Option4</p>
            {csvError && <p className="text-red-500 text-xs mt-1">{csvError}</p>}
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
                      {isAddingQuestion && !showPreview && (
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

                            {/* Image Upload */}
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Upload Image (Graph/Diagram)
                              </Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="cursor-pointer"
                              />
                              {questionForm.imageUrl && (
                                <div className="mt-2 relative">
                                  <img 
                                    src={questionForm.imageUrl} 
                                    alt="Preview" 
                                    className="max-w-xs rounded border"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => setQuestionForm({ ...questionForm, imageUrl: "" })}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Desmos Graph Expression */}
                            <DesmosInput
                              value={questionForm.graphExpression || ""}
                              onChange={(value) =>
                                setQuestionForm({ ...questionForm, graphExpression: value })
                              }
                            />

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
                              <Button variant="secondary" onClick={handlePreview}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Preview Mode */}
                      {showPreview && (
                        <QuestionPreview
                          question={questionForm}
                          onConfirm={handleSaveQuestion}
                          onCancel={() => setShowPreview(false)}
                          isEditing={!!editingQuestion}
                        />
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
                                    {question.imageUrl && (
                                      <Badge variant="outline" className="text-xs">
                                        🖼️ Image
                                      </Badge>
                                    )}
                                    {question.graphExpression && (
                                      <Badge variant="outline" className="text-xs">
                                        📊 Graph
                                      </Badge>
                                    )}
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

                              {/* Display Image if present */}
                              {question.imageUrl && (
                                <div className="my-3">
                                  <img 
                                    src={question.imageUrl} 
                                    alt="Question illustration" 
                                    className="max-w-md rounded border"
                                  />
                                </div>
                              )}

                              {/* Display Desmos Graph if present */}
                              {question.graphExpression && (
                                <div className="my-3">
                                  <DesmosGraph 
                                    expression={question.graphExpression}
                                    width={400}
                                    height={250}
                                  />
                                </div>
                              )}

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
