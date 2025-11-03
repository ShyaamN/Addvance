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
import Drills from "@/pages/Drills";
import CustomQuizStart from "@/pages/CustomQuizStart";
import { useLocation } from "wouter";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();
  
  // Don't redirect if we're already on a valid route
  useEffect(() => {
    // Only redirect to homepage on truly empty/invalid paths
    // Allow all defined routes to work normally
    const validRoutes = [
      '/',
      '/statistics',
      '/review',
      '/custom-quiz',
      '/custom-quiz/start',
      '/drills',
      '/teacher-dashboard',
      '/admin/login',
      '/admin/dashboard'
    ];
    
    const isValidRoute = validRoutes.some(route => location === route) || 
                        location.startsWith('/quiz/') ||
                        location.startsWith('/custom-quiz') ||
                        location.startsWith('/admin');
    
    // Only redirect if on an invalid/empty route
    if (!isValidRoute && location !== '/') {
      setLocation('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          <Route path="/custom-quiz/start" component={CustomQuizStart} />
          <Route path="/drills" component={Drills} />
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
