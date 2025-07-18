'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Star, 
  Crown, 
  Trophy, 
  Gift, 
  Lock, 
  Check, 
  Zap,
  Target,
  BookOpen,
  Brain,
  Flame,
  Users,
  Calendar,
  TrendingUp,
  Medal,
  Shield,
  Gem,
  Sparkles
} from 'lucide-react';
import { useGamificationStore, REWARD_LEVELS } from '@/lib/stores/gamificationStore';
import { Achievement, UserAchievement } from '../types/gamification';

interface RewardSystemProps {
  showAchievements?: boolean;
  showLevels?: boolean;
  showBadges?: boolean;
}

const RewardSystem: React.FC<RewardSystemProps> = ({
  showAchievements = true,
  showLevels = true,
  showBadges = true
}) => {
  const { 
    userPoints, 
    achievements, 
    userAchievements, 
    currentLevel, 
    pointsHistory 
  } = useGamificationStore();

  const [activeTab, setActiveTab] = useState<'achievements' | 'levels' | 'badges'>('achievements');

  // Mock achievements for demonstration
  const mockAchievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first interactive activity',
      icon: '🎯',
      pointsReward: 50,
      requirements: [{ type: 'activities', value: 1 }],
      rarity: 'common',
      category: 'Getting Started'
    },
    {
      id: 'content-creator',
      title: 'Content Creator',
      description: 'Generate 10 pieces of content',
      icon: '📝',
      pointsReward: 200,
      requirements: [{ type: 'activities', value: 10 }],
      rarity: 'rare',
      category: 'Content'
    },
    {
      id: 'knowledge-seeker',
      title: 'Knowledge Seeker',
      description: 'Earn 1000 points total',
      icon: '📚',
      pointsReward: 100,
      requirements: [{ type: 'points', value: 1000 }],
      rarity: 'common',
      category: 'Progress'
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      pointsReward: 300,
      requirements: [{ type: 'streak', value: 7 }],
      rarity: 'epic',
      category: 'Consistency'
    },
    {
      id: 'point-collector',
      title: 'Point Collector',
      description: 'Earn 500 points in a week',
      icon: '💰',
      pointsReward: 150,
      requirements: [{ type: 'points', value: 500, timeFrame: 'weekly' }],
      rarity: 'rare',
      category: 'Weekly Challenge'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Score 100% on 5 activities',
      icon: '⭐',
      pointsReward: 400,
      requirements: [{ type: 'activities', value: 5 }],
      rarity: 'epic',
      category: 'Excellence'
    },
    {
      id: 'road-runner',
      title: 'Road Runner',
      description: 'Complete 5 roadmap modules',
      icon: '🛣️',
      pointsReward: 500,
      requirements: [{ type: 'activities', value: 5 }],
      rarity: 'legendary',
      category: 'Roadmap'
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Reach Level 5',
      icon: '👨‍🏫',
      pointsReward: 1000,
      requirements: [{ type: 'points', value: 7500 }],
      rarity: 'legendary',
      category: 'Level'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300';
      case 'rare':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300';
      case 'epic':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300';
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Star className="w-4 h-4" />;
      case 'rare':
        return <Gem className="w-4 h-4" />;
      case 'epic':
        return <Crown className="w-4 h-4" />;
      case 'legendary':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const checkAchievementCompletion = (achievement: Achievement) => {
    if (!userPoints) return false;
    
    const requirement = achievement.requirements[0];
    
    switch (requirement.type) {
      case 'points':
        const points = requirement.timeFrame === 'weekly' ? userPoints.weeklyPoints :
                     requirement.timeFrame === 'monthly' ? userPoints.monthlyPoints :
                     requirement.timeFrame === 'yearly' ? userPoints.yearlyPoints :
                     userPoints.points;
        return points >= requirement.value;
      case 'activities':
        return pointsHistory.length >= requirement.value;
      case 'streak':
        return false; // Mock streak check
      default:
        return false;
    }
  };

  const getAchievementProgress = (achievement: Achievement) => {
    if (!userPoints) return 0;
    
    const requirement = achievement.requirements[0];
    
    switch (requirement.type) {
      case 'points':
        const points = requirement.timeFrame === 'weekly' ? userPoints.weeklyPoints :
                     requirement.timeFrame === 'monthly' ? userPoints.monthlyPoints :
                     requirement.timeFrame === 'yearly' ? userPoints.yearlyPoints :
                     userPoints.points;
        return Math.min((points / requirement.value) * 100, 100);
      case 'activities':
        return Math.min((pointsHistory.length / requirement.value) * 100, 100);
      case 'streak':
        return 0; // Mock streak progress
      default:
        return 0;
    }
  };

  const completedAchievements = mockAchievements.filter(checkAchievementCompletion);
  const availableAchievements = mockAchievements.filter(a => !checkAchievementCompletion(a));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Rewards & Achievements
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedAchievements.length} of {mockAchievements.length} achievements unlocked
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedAchievements.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Completed
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {showAchievements && (
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Achievements
          </button>
        )}
        {showLevels && (
          <button
            onClick={() => setActiveTab('levels')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'levels'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Levels
          </button>
        )}
        {showBadges && (
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'badges'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Badges
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Completed Achievements */}
            {completedAchievements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Completed Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex items-center gap-1">
                            {getRarityIcon(achievement.rarity)}
                            <span className="text-xs font-medium uppercase tracking-wide">
                              {achievement.rarity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">+{achievement.pointsReward}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {achievement.description}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.category}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Available Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableAchievements.map((achievement) => {
                  const progress = getAchievementProgress(achievement);
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl opacity-60">{achievement.icon}</span>
                          <div className="flex items-center gap-1">
                            {getRarityIcon(achievement.rarity)}
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              {achievement.rarity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Gift className="w-4 h-4" />
                          <span className="text-sm font-medium">+{achievement.pointsReward}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {achievement.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.category}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'levels' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Level System
              </h3>
              <div className="space-y-4">
                {REWARD_LEVELS.map((level, index) => {
                  const isCurrentLevel = currentLevel?.level === level.level;
                  const isUnlocked = (userPoints?.points || 0) >= level.minPoints;
                  
                  return (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        isCurrentLevel
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : isUnlocked
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                            isUnlocked ? 'bg-white shadow-lg' : 'bg-gray-200 dark:bg-gray-600'
                          }`}>
                            {isUnlocked ? level.badge : <Lock className="w-6 h-6 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className={`font-semibold ${level.color} ${
                              isUnlocked ? '' : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              Level {level.level}: {level.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {level.minPoints.toLocaleString()} - {level.maxPoints === Infinity ? '∞' : level.maxPoints.toLocaleString()} points
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCurrentLevel && (
                            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                          {isUnlocked && !isCurrentLevel && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Perks:</p>
                        <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          {level.perks.map((perk, perkIndex) => (
                            <li key={perkIndex} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Badge Collection
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {REWARD_LEVELS.map((level) => {
                  const isUnlocked = (userPoints?.points || 0) >= level.minPoints;
                  
                  return (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl text-center ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700'
                          : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="text-4xl mb-2">
                        {isUnlocked ? level.badge : '🔒'}
                      </div>
                      <div className={`text-sm font-medium ${
                        isUnlocked ? level.color : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        Level {level.level}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {level.title}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardSystem; 