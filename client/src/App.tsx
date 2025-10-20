import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import Statistics from "@/pages/Statistics";
import Review from "@/pages/Review";
import CustomQuiz from "@/pages/CustomQuiz";
import TeacherDashboard from "@/pages/TeacherDashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import { useLocation } from "wouter";

function Router() {
  const [location, setLocation] = useLocation();
  const isQuizPage = location.startsWith("/quiz/");
  const isStatsPage = location === "/statistics";
  const isReviewPage = location === "/review";
  const isCustomQuizPage = location.startsWith("/custom-quiz");
  const isTeacherDashboard = location.startsWith("/teacher-dashboard");
  const isAdminPage = location.startsWith("/admin");

  // Hide header on admin pages
  const showHeader = !isAdminPage;

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <Header 
          onHomeClick={() => setLocation("/")} 
          showHome={isQuizPage || isStatsPage || isReviewPage || isCustomQuizPage || isTeacherDashboard}
        />
      )}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quiz/:topicId" component={Quiz} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/review" component={Review} />
          <Route path="/custom-quiz" component={CustomQuiz} />
          <Route path="/teacher-dashboard" component={TeacherDashboard} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
