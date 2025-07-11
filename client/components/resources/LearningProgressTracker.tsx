'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Book, Clock, Star, TrendingUp, Calendar, Award } from 'lucide-react';

interface LearningActivity {
  id: string;
  type: 'puzzle' | 'quiz' | 'skill' | 'reading';
  title: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  completedAt?: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningStats {
  totalActivities: number;
  completedActivities: number;
  totalTimeSpent: number;
  averageScore: number;
  streak: number;
  level: number;
  xp: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

const sampleActivities: LearningActivity[] = [
  {
    id: '1',
    type: 'puzzle',
    title: 'Sort Numbers Puzzle',
    completed: true,
    score: 85,
    timeSpent: 120,
    completedAt: new Date('2024-01-15'),
    difficulty: 'beginner'
  },
  {
    id: '2',
    type: 'quiz',
    title: 'JavaScript Basics Quiz',
    completed: true,
    score: 92,
    timeSpent: 180,
    completedAt: new Date('2024-01-16'),
    difficulty: 'intermediate'
  },
  {
    id: '3',
    type: 'puzzle',
    title: 'Animal Categorization',
    completed: false,
    timeSpent: 45,
    difficulty: 'beginner'
  }
];

const sampleAchievements: Achievement[] = [
  {
    id: 'first-puzzle',
    title: 'Puzzle Master',
    description: 'Complete your first puzzle',
    icon: '🧩',
    unlockedAt: new Date('2024-01-15'),
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'quiz-streak',
    title: 'Quiz Streak',
    description: 'Complete 5 quizzes in a row',
    icon: '🔥',
    progress: 2,
    maxProgress: 5
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a puzzle in under 60 seconds',
    icon: '⚡',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 100% on any quiz',
    icon: '💯',
    progress: 0,
    maxProgress: 1
  }
];

export default function LearningProgressTracker() {
  const [activities, setActivities] = useState<LearningActivity[]>(sampleActivities);
  const [stats, setStats] = useState<LearningStats>({
    totalActivities: 0,
    completedActivities: 0,
    totalTimeSpent: 0,
    averageScore: 0,
    streak: 0,
    level: 1,
    xp: 0,
    achievements: sampleAchievements
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    calculateStats();
  }, [activities]);

  const calculateStats = () => {
    const completed = activities.filter(a => a.completed);
    const totalScore = completed.reduce((sum, a) => sum + (a.score || 0), 0);
    const avgScore = completed.length > 0 ? totalScore / completed.length : 0;
    const totalTime = activities.reduce((sum, a) => sum + a.timeSpent, 0);
    
    // Calculate XP and level
    const xp = completed.reduce((sum, a) => {
      const baseXP = 100;
      const scoreMultiplier = (a.score || 0) / 100;
      const difficultyMultiplier = a.difficulty === 'advanced' ? 1.5 : a.difficulty === 'intermediate' ? 1.2 : 1;
      return sum + (baseXP * scoreMultiplier * difficultyMultiplier);
    }, 0);
    
    const level = Math.floor(xp / 1000) + 1;
    
    setStats({
      totalActivities: activities.length,
      completedActivities: completed.length,
      totalTimeSpent: totalTime,
      averageScore: avgScore,
      streak: calculateStreak(),
      level,
      xp,
      achievements: sampleAchievements
    });
  };

  const calculateStreak = () => {
    // Simple streak calculation - count consecutive days with completed activities
    const sortedActivities = activities
      .filter(a => a.completed && a.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    if (sortedActivities.length === 0) return 0;
    
    let streak = 1;
    let currentDate = new Date(sortedActivities[0].completedAt!);
    
    for (let i = 1; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].completedAt!);
      const daysDifference = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference === 1) {
        streak++;
        currentDate = activityDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getActivityIcon = (type: LearningActivity['type']) => {
    switch (type) {
      case 'puzzle': return '🧩';
      case 'quiz': return '❓';
      case 'skill': return '🎯';
      case 'reading': return '📚';
      default: return '📝';
    }
  };

  const getDifficultyColor = (difficulty: LearningActivity['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
            <p className="opacity-90">Track your learning journey and achievements</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-4 mb-2">
              <Trophy className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold">Level {stats.level}</div>
            <div className="text-sm opacity-90">{Math.floor(stats.xp)} XP</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.completedActivities}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {stats.totalActivities - stats.completedActivities} remaining
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{Math.round(stats.averageScore)}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">From {stats.completedActivities} activities</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{formatTime(stats.totalTimeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Across all activities</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Keep it up!</div>
        </motion.div>
      </div>

      {/* Level Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Level Progress</h2>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold">
            Level {stats.level}
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{Math.floor(stats.xp % 1000)} XP</span>
              <span>1000 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((stats.xp % 1000) / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-2xl">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {activity.completed ? (
                    <span className="flex items-center gap-2">
                      <span className="text-green-600">✓ Completed</span>
                      {activity.score && <span>• Score: {activity.score}%</span>}
                      <span>• Time: {formatTime(activity.timeSpent)}</span>
                    </span>
                  ) : (
                    <span className="text-orange-600">In Progress • {formatTime(activity.timeSpent)}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {activity.completedAt && (
                  <div className="text-sm text-gray-500">
                    {activity.completedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlockedAt
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-2xl ${achievement.unlockedAt ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      achievement.unlockedAt ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 