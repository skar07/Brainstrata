// Gamification Types
export interface UserPoints {
  id: string;
  userId: string;
  points: number;
  weeklyPoints: number;
  monthlyPoints: number;
  yearlyPoints: number;
  lastUpdated: Date;
  region: string;
  country: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  points: number;
  type: PointsType;
  activity: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

export enum PointsType {
  INTERACTIVE_ACTIVITY = 'interactive_activity',
  CONTENT_GENERATION = 'content_generation',
  ROADMAP_PROGRESS = 'roadmap_progress',
  DAILY_LOGIN = 'daily_login',
  STREAK_BONUS = 'streak_bonus',
  ACHIEVEMENT_UNLOCK = 'achievement_unlock'
}

export interface PointsConfig {
  interactiveActivity: {
    correctAnswer: number;
    completedQuiz: number;
    perfectScore: number;
  };
  contentGeneration: {
    generateContent: number;
    qualityBonus: number;
    shareContent: number;
  };
  roadmapProgress: {
    completeModule: number;
    finishCourse: number;
    skillLevelUp: number;
  };
  engagement: {
    dailyLogin: number;
    weeklyStreak: number;
    monthlyStreak: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar: string;
  points: number;
  weeklyPoints: number;
  monthlyPoints: number;
  yearlyPoints: number;
  region: string;
  country: string;
  level: number;
  badge: string;
  streak: number;
  lastActive: Date;
}

export interface LeaderboardFilters {
  timeFrame: 'weekly' | 'monthly' | 'yearly' | 'all-time';
  scope: 'global' | 'regional' | 'country';
  region?: string;
  country?: string;
  limit: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  requirements: AchievementRequirement[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

export interface AchievementRequirement {
  type: 'points' | 'activities' | 'streak' | 'time';
  value: number;
  timeFrame?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: Date;
  progress: number;
  completed: boolean;
}

export interface RewardSystem {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  badge: string;
  perks: string[];
  color: string;
}

export interface UserStats {
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  yearlyPoints: number;
  level: number;
  rank: number;
  weeklyRank: number;
  monthlyRank: number;
  yearlyRank: number;
  streak: number;
  activitiesCompleted: number;
  contentGenerated: number;
  achievementsUnlocked: number;
  region: string;
  country: string;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  userEntry?: LeaderboardEntry;
  totalParticipants: number;
  filters: LeaderboardFilters;
  lastUpdated: Date;
} 