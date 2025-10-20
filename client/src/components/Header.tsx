import { Home, Moon, Sun, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface HeaderProps {
  onHomeClick?: () => void;
  showHome?: boolean;
}

export default function Header({ onHomeClick, showHome = true }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">+</span>
            <h1 className="font-serif text-xl font-bold">
              <span className="text-primary">Add</span>
              <span className="text-foreground">vance</span>
              <span className="text-primary">Maths</span>
            </h1>
          </div>
          <span className="text-sm text-muted-foreground hidden sm:inline">Quiz Mode</span>
        </div>
        
        <div className="flex items-center gap-2">
          {showHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onHomeClick}
              data-testid="button-home"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setLocation("/admin/login")}
            className="gap-2"
            data-testid="button-admin-login"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Login</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            data-testid="button-theme-toggle"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
