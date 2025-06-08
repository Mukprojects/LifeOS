export interface UserProfile {
  // Basic Info
  age: number;
  location: string;
  profession: string;
  workHours: number;
  socialMediaHours: number;

  // Life Audit
  frustrations: string;
  dailyRoutine: string;
  proudHabit: string;
  avoidingWhat: string;

  // Ratings (1-10)
  productivity: number;
  health: number;
  motivation: number;
  mentalHealth: number;
  careerDirection: number;

  // Goals
  goals: Goal[];

  // Streak Data (optional for existing users)
  streakData?: {
    currentStreak: number;
    lastLoginDate: string;
    totalDays: number;
  };
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  category: string;
  milestones: Milestone[];
  progress: number;
  checkpoints?: Checkpoint[];
  aiAnalysis?: {
    strengths: string[];
    challenges: string[];
    recommendations: string[];
  };
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  month: number;
  tasks: Task[];
  completed: boolean;
  subtasks?: Subtask[];
  timeline?: Timeline;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  resources?: string[];
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  parentTaskId: string;
}

export interface Timeline {
  startDate: string;
  endDate: string;
  keyDates: {
    date: string;
    description: string;
  }[];
}

export interface Checkpoint {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  achieved: boolean;
  milestoneId: string;
}

export interface LifeScore {
  overall: number;
  productivity: number;
  focus: number;
  confidence: number;
  goalProgress: number;
}

export interface LifeSummary {
  narrative: string;
  score: LifeScore;
  insights: string[];
  strengths: string[];
  improvements: string[];
}

export type AppPage = 'landing' | 'onboarding' | 'summary' | 'planner' | 'dashboard' | 'settings' | 'resources' | 'success' | 'cancel';

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  amazonUrl?: string;
  category: string;
  relevantGoals: string[]; // Goal titles this book is relevant for
  tags: string[];
  rating?: number;
}

export interface ResourcesData {
  books: BookRecommendation[];
  personalizedNote: string;
  lastUpdated: string;
}