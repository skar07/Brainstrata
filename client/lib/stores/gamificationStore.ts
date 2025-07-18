import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  UserPoints, 
  PointsTransaction, 
  PointsType, 
  PointsConfig, 
  LeaderboardEntry, 
  LeaderboardFilters, 
  Achievement, 
  UserAchievement, 
  RewardSystem, 
  UserStats,
  LeaderboardData
} from '../../types/gamification';

// Points Configuration
export const POINTS_CONFIG: PointsConfig = {
  interactiveActivity: {
    correctAnswer: 10,
    completedQuiz: 50,
    perfectScore: 100
  },
  contentGeneration: {
    generateContent: 25,
    qualityBonus: 50,
    shareContent: 15
  },
  roadmapProgress: {
    completeModule: 100,
    finishCourse: 500,
    skillLevelUp: 200
  },
  engagement: {
    dailyLogin: 5,
    weeklyStreak: 50,
    monthlyStreak: 200
  }
};

// Reward System Levels
export const REWARD_LEVELS: RewardSystem[] = [
  {
    level: 1,
    title: "Novice Learner",
    minPoints: 0,
    maxPoints: 499,
    badge: "🌱",
    perks: ["Basic dashboard access"],
    color: "text-gray-500"
  },
  {
    level: 2,
    title: "Curious Explorer",
    minPoints: 500,
    maxPoints: 1499,
    badge: "🔍",
    perks: ["Basic dashboard access", "Progress tracking"],
    color: "text-blue-500"
  },
  {
    level: 3,
    title: "Knowledge Seeker",
    minPoints: 1500,
    maxPoints: 3499,
    badge: "📚",
    perks: ["All Level 2 perks", "Advanced analytics"],
    color: "text-green-500"
  },
  {
    level: 4,
    title: "Skilled Learner",
    minPoints: 3500,
    maxPoints: 7499,
    badge: "⚡",
    perks: ["All Level 3 perks", "Custom study plans"],
    color: "text-yellow-500"
  },
  {
    level: 5,
    title: "Expert Scholar",
    minPoints: 7500,
    maxPoints: 14999,
    badge: "🏆",
    perks: ["All Level 4 perks", "Mentor privileges"],
    color: "text-purple-500"
  },
  {
    level: 6,
    title: "Master Sage",
    minPoints: 15000,
    maxPoints: 29999,
    badge: "👑",
    perks: ["All Level 5 perks", "Content creation tools"],
    color: "text-orange-500"
  },
  {
    level: 7,
    title: "Legendary Genius",
    minPoints: 30000,
    maxPoints: Infinity,
    badge: "💎",
    perks: ["All Level 6 perks", "Exclusive features", "Leadership board"],
    color: "text-pink-500"
  }
];

interface GamificationState {
  userPoints: UserPoints | null;
  pointsHistory: PointsTransaction[];
  leaderboardData: LeaderboardData | null;
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  currentLevel: RewardSystem | null;
  userStats: UserStats | null;
  
  // Actions
  addPoints: (type: PointsType, activity: string, points?: number, description?: string) => void;
  updateLeaderboard: (filters: LeaderboardFilters) => Promise<void>;
  checkAchievements: () => void;
  getUserLevel: (points: number) => RewardSystem;
  getPointsForActivity: (type: PointsType, activity: string) => number;
  resetWeeklyPoints: () => void;
  resetMonthlyPoints: () => void;
  resetYearlyPoints: () => void;
  getUserStats: () => UserStats | null;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      userPoints: null,
      pointsHistory: [],
      leaderboardData: null,
      achievements: [],
      userAchievements: [],
      currentLevel: null,
      userStats: null,

      addPoints: (type: PointsType, activity: string, customPoints?: number, description?: string) => {
        const state = get();
        const points = customPoints || state.getPointsForActivity(type, activity);
        
        if (points <= 0) return;

        const transaction: PointsTransaction = {
          id: Date.now().toString(),
          userId: state.userPoints?.userId || 'current-user',
          points,
          type,
          activity,
          description: description || `${activity} completed`,
          timestamp: new Date()
        };

        const currentPoints = state.userPoints || {
          id: 'user-points',
          userId: 'current-user',
          points: 0,
          weeklyPoints: 0,
          monthlyPoints: 0,
          yearlyPoints: 0,
          lastUpdated: new Date(),
          region: 'Global',
          country: 'Unknown'
        };

        const updatedPoints: UserPoints = {
          ...currentPoints,
          points: currentPoints.points + points,
          weeklyPoints: currentPoints.weeklyPoints + points,
          monthlyPoints: currentPoints.monthlyPoints + points,
          yearlyPoints: currentPoints.yearlyPoints + points,
          lastUpdated: new Date()
        };

        const newLevel = state.getUserLevel(updatedPoints.points);

        set({
          userPoints: updatedPoints,
          pointsHistory: [...state.pointsHistory, transaction],
          currentLevel: newLevel
        });

        // Check for achievements after adding points
        state.checkAchievements();
      },

      updateLeaderboard: async (filters: LeaderboardFilters) => {
        // Mock leaderboard data - in real app, this would fetch from API
        const mockLeaderboard: LeaderboardEntry[] = [
          {
            rank: 1,
            userId: 'user-1',
            userName: 'Alex Johnson',
            avatar: 'A',
            points: 15420,
            weeklyPoints: 1240,
            monthlyPoints: 4680,
            yearlyPoints: 15420,
            region: 'North America',
            country: 'USA',
            level: 6,
            badge: '👑',
            streak: 45,
            lastActive: new Date()
          },
          {
            rank: 2,
            userId: 'user-2',
            userName: 'Sarah Chen',
            avatar: 'S',
            points: 14890,
            weeklyPoints: 1180,
            monthlyPoints: 4320,
            yearlyPoints: 14890,
            region: 'Asia',
            country: 'Singapore',
            level: 5,
            badge: '🏆',
            streak: 38,
            lastActive: new Date()
          },
          {
            rank: 3,
            userId: 'user-3',
            userName: 'Marcus Brown',
            avatar: 'M',
            points: 13250,
            weeklyPoints: 980,
            monthlyPoints: 3850,
            yearlyPoints: 13250,
            region: 'Europe',
            country: 'Germany',
            level: 5,
            badge: '🏆',
            streak: 52,
            lastActive: new Date()
          },
          {
            rank: 4,
            userId: 'current-user',
            userName: 'You',
            avatar: 'Y',
            points: get().userPoints?.points || 0,
            weeklyPoints: get().userPoints?.weeklyPoints || 0,
            monthlyPoints: get().userPoints?.monthlyPoints || 0,
            yearlyPoints: get().userPoints?.yearlyPoints || 0,
            region: 'Global',
            country: 'Unknown',
            level: get().currentLevel?.level || 1,
            badge: get().currentLevel?.badge || '🌱',
            streak: 12,
            lastActive: new Date()
          }
        ];

        const leaderboardData: LeaderboardData = {
          entries: mockLeaderboard,
          userEntry: mockLeaderboard.find(entry => entry.userId === 'current-user'),
          totalParticipants: 10234,
          filters,
          lastUpdated: new Date()
        };

        set({ leaderboardData });
      },

      checkAchievements: () => {
        const state = get();
        const userPoints = state.userPoints;
        if (!userPoints) return;

        // Mock achievements checking
        const mockAchievements: Achievement[] = [
          {
            id: 'first-steps',
            title: 'First Steps',
            description: 'Complete your first activity',
            icon: '🎯',
            pointsReward: 50,
            requirements: [{ type: 'activities', value: 1 }],
            rarity: 'common',
            category: 'Getting Started'
          },
          {
            id: 'point-collector',
            title: 'Point Collector',
            description: 'Earn 1000 points',
            icon: '💰',
            pointsReward: 100,
            requirements: [{ type: 'points', value: 1000 }],
            rarity: 'common',
            category: 'Points'
          },
          {
            id: 'streak-master',
            title: 'Streak Master',
            description: 'Maintain a 7-day streak',
            icon: '🔥',
            pointsReward: 200,
            requirements: [{ type: 'streak', value: 7 }],
            rarity: 'rare',
            category: 'Consistency'
          }
        ];

        set({ achievements: mockAchievements });
      },

      getUserLevel: (points: number) => {
        return REWARD_LEVELS.find(level => points >= level.minPoints && points <= level.maxPoints) || REWARD_LEVELS[0];
      },

      getPointsForActivity: (type: PointsType, activity: string) => {
        switch (type) {
          case PointsType.INTERACTIVE_ACTIVITY:
            if (activity.includes('correct')) return POINTS_CONFIG.interactiveActivity.correctAnswer;
            if (activity.includes('quiz')) return POINTS_CONFIG.interactiveActivity.completedQuiz;
            if (activity.includes('perfect')) return POINTS_CONFIG.interactiveActivity.perfectScore;
            return 10;
          case PointsType.CONTENT_GENERATION:
            if (activity.includes('generate')) return POINTS_CONFIG.contentGeneration.generateContent;
            if (activity.includes('quality')) return POINTS_CONFIG.contentGeneration.qualityBonus;
            if (activity.includes('share')) return POINTS_CONFIG.contentGeneration.shareContent;
            return 25;
          case PointsType.ROADMAP_PROGRESS:
            if (activity.includes('module')) return POINTS_CONFIG.roadmapProgress.completeModule;
            if (activity.includes('course')) return POINTS_CONFIG.roadmapProgress.finishCourse;
            if (activity.includes('skill')) return POINTS_CONFIG.roadmapProgress.skillLevelUp;
            return 100;
          case PointsType.DAILY_LOGIN:
            return POINTS_CONFIG.engagement.dailyLogin;
          case PointsType.STREAK_BONUS:
            return POINTS_CONFIG.engagement.weeklyStreak;
          default:
            return 0;
        }
      },

      resetWeeklyPoints: () => {
        const state = get();
        if (state.userPoints) {
          set({
            userPoints: {
              ...state.userPoints,
              weeklyPoints: 0,
              lastUpdated: new Date()
            }
          });
        }
      },

      resetMonthlyPoints: () => {
        const state = get();
        if (state.userPoints) {
          set({
            userPoints: {
              ...state.userPoints,
              monthlyPoints: 0,
              lastUpdated: new Date()
            }
          });
        }
      },

      resetYearlyPoints: () => {
        const state = get();
        if (state.userPoints) {
          set({
            userPoints: {
              ...state.userPoints,
              yearlyPoints: 0,
              lastUpdated: new Date()
            }
          });
        }
      },

      getUserStats: () => {
        const state = get();
        const userPoints = state.userPoints;
        const currentLevel = state.currentLevel;
        
        if (!userPoints || !currentLevel) return null;

        return {
          totalPoints: userPoints.points,
          weeklyPoints: userPoints.weeklyPoints,
          monthlyPoints: userPoints.monthlyPoints,
          yearlyPoints: userPoints.yearlyPoints,
          level: currentLevel.level,
          rank: state.leaderboardData?.userEntry?.rank || 0,
          weeklyRank: state.leaderboardData?.userEntry?.rank || 0,
          monthlyRank: state.leaderboardData?.userEntry?.rank || 0,
          yearlyRank: state.leaderboardData?.userEntry?.rank || 0,
          streak: state.leaderboardData?.userEntry?.streak || 0,
          activitiesCompleted: state.pointsHistory.filter(t => t.type === PointsType.INTERACTIVE_ACTIVITY).length,
          contentGenerated: state.pointsHistory.filter(t => t.type === PointsType.CONTENT_GENERATION).length,
          achievementsUnlocked: state.userAchievements.filter(a => a.completed).length,
          region: userPoints.region,
          country: userPoints.country
        };
      }
    }),
    {
      name: 'gamification-store',
      version: 1
    }
  )
); 