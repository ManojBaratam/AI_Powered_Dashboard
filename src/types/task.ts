export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  status: "todo" | "in-progress" | "completed";
  points: number;
  subtasks: SubTask[];
  assignedTo?: string;
  completedBy?: string;
  completedAt?: string;
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompleted: number;
  onTimeRate: number;
  level: number;
  pointsToNextLevel: number;
  badges: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  tasksCompleted: number;
  streak: number;
  department: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  totalPoints: number;
  memberCount: number;
  avgTaskCompletion: number;
  members: LeaderboardEntry[];
}