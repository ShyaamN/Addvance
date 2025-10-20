// Local storage management for user progress and statistics
// Also sets cookies for cross-session tracking

export interface QuizResult {
  topicId: string;
  topicName: string;
  score: number;
  total: number;
  difficulty: 'foundation' | 'higher';
  timestamp: number;
  timeSpent: number;
}

export interface UserProgress {
  quizHistory: QuizResult[];
  achievements: string[];
  lastVisit: number;
  streak: number;
  lastStreakDate: string;
  totalQuizzesTaken: number;
  perfectScores: number;
}

export interface UserPreferences {
  difficulty: 'foundation' | 'higher';
  studyMode: boolean;
}

const STORAGE_KEYS = {
  PROGRESS: 'addvance_quiz_progress',
  PREFERENCES: 'addvance_quiz_preferences',
};

// Cookie utilities for cross-session tracking
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Initialize user ID cookie if doesn't exist
const initUserTracking = () => {
  if (!getCookie('addvance_user_id')) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCookie('addvance_user_id', userId, 365);
  }
  // Update last visit cookie
  setCookie('addvance_last_visit', Date.now().toString(), 365);
};

// Initialize tracking on module load
initUserTracking();

export const storage = {
  // Get user progress
  getProgress(): UserProgress {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!data) {
      return {
        quizHistory: [],
        achievements: [],
        lastVisit: Date.now(),
        streak: 0,
        lastStreakDate: new Date().toDateString(),
        totalQuizzesTaken: 0,
        perfectScores: 0,
      };
    }
    return JSON.parse(data);
  },

  // Save user progress
  saveProgress(progress: UserProgress) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  },

  // Add quiz result
  addQuizResult(result: QuizResult) {
    const progress = this.getProgress();
    progress.quizHistory.unshift(result);
    progress.totalQuizzesTaken += 1;
    
    if (result.score === result.total) {
      progress.perfectScores += 1;
    }

    // Update streak
    const today = new Date().toDateString();
    const lastDate = new Date(progress.lastStreakDate);
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (today !== progress.lastStreakDate) {
      if (yesterday === progress.lastStreakDate) {
        progress.streak += 1;
      } else if (today !== progress.lastStreakDate) {
        progress.streak = 1;
      }
      progress.lastStreakDate = today;
    }

    progress.lastVisit = Date.now();
    
    this.saveProgress(progress);
    this.checkAchievements(progress);
  },

  // Check and unlock achievements
  checkAchievements(progress: UserProgress) {
    const achievements = [...progress.achievements];
    
    if (progress.totalQuizzesTaken >= 1 && !achievements.includes('first_quiz')) {
      achievements.push('first_quiz');
    }
    if (progress.perfectScores >= 1 && !achievements.includes('perfect_score')) {
      achievements.push('perfect_score');
    }
    if (progress.totalQuizzesTaken >= 10 && !achievements.includes('quiz_master')) {
      achievements.push('quiz_master');
    }
    if (progress.perfectScores >= 5 && !achievements.includes('perfectionist')) {
      achievements.push('perfectionist');
    }
    if (progress.streak >= 3 && !achievements.includes('streak_3')) {
      achievements.push('streak_3');
    }
    if (progress.streak >= 7 && !achievements.includes('streak_7')) {
      achievements.push('streak_7');
    }
    if (progress.totalQuizzesTaken >= 50 && !achievements.includes('dedicated')) {
      achievements.push('dedicated');
    }

    if (achievements.length > progress.achievements.length) {
      progress.achievements = achievements;
      this.saveProgress(progress);
    }
  },

  // Get user preferences
  getPreferences(): UserPreferences {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!data) {
      return {
        difficulty: 'foundation',
        studyMode: false,
      };
    }
    return JSON.parse(data);
  },

  // Save user preferences
  savePreferences(preferences: UserPreferences) {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  },

  // Get statistics
  getStatistics() {
    const progress = this.getProgress();
    const totalAttempts = progress.quizHistory.length;
    const totalCorrect = progress.quizHistory.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = progress.quizHistory.reduce((sum, r) => sum + r.total, 0);
    
    const topicStats = new Map<string, { correct: number; total: number; attempts: number }>();
    
    progress.quizHistory.forEach(result => {
      const existing = topicStats.get(result.topicId) || { correct: 0, total: 0, attempts: 0 };
      existing.correct += result.score;
      existing.total += result.total;
      existing.attempts += 1;
      topicStats.set(result.topicId, existing);
    });

    const topicPerformance = Array.from(topicStats.entries()).map(([topicId, stats]) => ({
      topicId,
      topicName: progress.quizHistory.find(h => h.topicId === topicId)?.topicName || '',
      percentage: (stats.correct / stats.total) * 100,
      attempts: stats.attempts,
    })).sort((a, b) => a.percentage - b.percentage);

    return {
      totalAttempts,
      averageScore: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      perfectScores: progress.perfectScores,
      currentStreak: progress.streak,
      topicPerformance,
      recentActivity: progress.quizHistory.slice(0, 10),
    };
  },

  // Clear all data
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  },

  // Get user ID from cookie
  getUserId(): string | null {
    return getCookie('addvance_user_id');
  },

  // Track user activity
  trackActivity() {
    setCookie('addvance_last_visit', Date.now().toString(), 365);
  },
};

export const ACHIEVEMENTS = {
  first_quiz: {
    id: 'first_quiz',
    name: 'Getting Started',
    description: 'Complete your first quiz',
    icon: '🎯',
  },
  perfect_score: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '⭐',
  },
  quiz_master: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: '🏆',
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 5 perfect scores',
    icon: '💯',
  },
  streak_3: {
    id: 'streak_3',
    name: '3 Day Streak',
    description: 'Practice 3 days in a row',
    icon: '🔥',
  },
  streak_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Practice 7 days in a row',
    icon: '🚀',
  },
  dedicated: {
    id: 'dedicated',
    name: 'Dedicated Learner',
    description: 'Complete 50 quizzes',
    icon: '📚',
  },
};
