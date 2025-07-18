'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  TrendingUp, 
  Clock, 
  Award, 
  Target, 
  Zap, 
  Crown,
  ChevronRight,
  Plus,
  Minus,
  Calendar,
  BookOpen,
  Brain,
  Trophy,
  Flame,
  Gift,
  LineChart
} from 'lucide-react';
import { useGamificationStore, REWARD_LEVELS } from '@/lib/stores/gamificationStore';
import { PointsType } from '../types/gamification';

interface PointsTrackerProps {
  showRecentActivity?: boolean;
  showLevelProgress?: boolean;
  compact?: boolean;
}

const PointsTracker: React.FC<PointsTrackerProps> = ({
  showRecentActivity = true,
  showLevelProgress = true,
  compact = false
}) => {
  const { 
    userPoints, 
    pointsHistory, 
    currentLevel, 
    getUserLevel,
    addPoints,
    getUserStats
  } = useGamificationStore();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);

  const userStats = getUserStats();
  const recentActivity = pointsHistory.slice(-5).reverse();

  // Calculate progress to next level
  const getNextLevel = () => {
    if (!currentLevel || !userPoints) return null;
    const nextLevelIndex = REWARD_LEVELS.findIndex(level => level.level === currentLevel.level + 1);
    return nextLevelIndex !== -1 ? REWARD_LEVELS[nextLevelIndex] : null;
  };

  const nextLevel = getNextLevel();
  const progressToNextLevel = nextLevel 
    ? ((userPoints?.points || 0) - currentLevel!.minPoints) / (nextLevel.minPoints - currentLevel!.minPoints) * 100
    : 100;

  const getPointsForTimeFrame = () => {
    if (!userPoints) return 0;
    switch (selectedTimeFrame) {
      case 'weekly':
        return userPoints.weeklyPoints;
      case 'monthly':
        return userPoints.monthlyPoints;
      case 'yearly':
        return userPoints.yearlyPoints;
      default:
        return userPoints.points;
    }
  };

  const getActivityIcon = (type: PointsType) => {
    switch (type) {
      case PointsType.INTERACTIVE_ACTIVITY:
        return <Brain className="w-4 h-4" />;
      case PointsType.CONTENT_GENERATION:
        return <BookOpen className="w-4 h-4" />;
      case PointsType.ROADMAP_PROGRESS:
        return <Target className="w-4 h-4" />;
      case PointsType.DAILY_LOGIN:
        return <Calendar className="w-4 h-4" />;
      case PointsType.STREAK_BONUS:
        return <Flame className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: PointsType) => {
    switch (type) {
      case PointsType.INTERACTIVE_ACTIVITY:
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case PointsType.CONTENT_GENERATION:
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case PointsType.ROADMAP_PROGRESS:
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case PointsType.DAILY_LOGIN:
        return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case PointsType.STREAK_BONUS:
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const handleAddTestPoints = () => {
    addPoints(PointsType.INTERACTIVE_ACTIVITY, 'test_activity', 50, 'Test activity completed');
    setShowPointsAnimation(true);
    setTimeout(() => setShowPointsAnimation(false), 2000);
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Points</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {userPoints?.points.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Crown className="w-4 h-4" />
              <span>Level {currentLevel?.level || 1}</span>
            </div>
            <p className="text-xs text-gray-400">{currentLevel?.title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Points Display */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Your Points</h3>
                <p className="text-white/80">Keep earning to level up!</p>
              </div>
            </div>
            <button
              onClick={handleAddTestPoints}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Test Points
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {userPoints?.points.toLocaleString() || 0}
              </div>
              <div className="text-sm text-white/80">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {currentLevel?.level || 1}
              </div>
              <div className="text-sm text-white/80">Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {userStats?.rank || 0}
              </div>
              <div className="text-sm text-white/80">Rank</div>
            </div>
          </div>
        </div>

        {/* Points Animation */}
        <AnimatePresence>
          {showPointsAnimation && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white"
            >
              +50 Points!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time Frame Points */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Points Timeline
          </h3>
          <div className="flex items-center gap-2">
            {(['weekly', 'monthly', 'yearly'] as const).map((timeFrame) => (
              <button
                key={timeFrame}
                onClick={() => setSelectedTimeFrame(timeFrame)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeFrame === timeFrame
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {userPoints?.weeklyPoints.toLocaleString() || 0}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Weekly</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {userPoints?.monthlyPoints.toLocaleString() || 0}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Monthly</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {userPoints?.yearlyPoints.toLocaleString() || 0}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Yearly</div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      {showLevelProgress && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Level Progress
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentLevel?.badge}</span>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Level {currentLevel?.level || 1}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentLevel?.title}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {currentLevel?.minPoints.toLocaleString()} points
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {nextLevel ? `${nextLevel.minPoints.toLocaleString()} points` : 'Max Level'}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
              ></div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(progressToNextLevel)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {nextLevel ? `${nextLevel.minPoints - (userPoints?.points || 0)} points to next level` : 'Max level reached!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {showRecentActivity && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>

          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                    <Plus className="w-4 h-4" />
                    <span>{activity.points}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start earning points by completing activities!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsTracker; 