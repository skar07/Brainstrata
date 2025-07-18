'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Filter, 
  Calendar, 
  Users, 
  Award,
  Clock,
  ChevronDown,
  Search,
  RefreshCw
} from 'lucide-react';
import { useGamificationStore } from '@/lib/stores/gamificationStore';
import { LeaderboardFilters, LeaderboardEntry } from '../types/gamification';

interface LeaderboardProps {
  showUserHighlight?: boolean;
  maxEntries?: number;
  showFilters?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  showUserHighlight = true,
  maxEntries = 50,
  showFilters = true
}) => {
  const { 
    leaderboardData, 
    updateLeaderboard, 
    userPoints,
    currentLevel 
  } = useGamificationStore();

  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeFrame: 'weekly',
    scope: 'global',
    limit: maxEntries
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Available regions for filtering
  const regions = [
    'Global',
    'North America',
    'Europe',
    'Asia',
    'South America',
    'Africa',
    'Oceania'
  ];

  const countries = [
    'USA',
    'Canada',
    'UK',
    'Germany',
    'France',
    'Japan',
    'Singapore',
    'Australia',
    'Brazil',
    'India'
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [filters]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      await updateLeaderboard(filters);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof LeaderboardFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getPointsForTimeFrame = (entry: LeaderboardEntry) => {
    switch (filters.timeFrame) {
      case 'weekly':
        return entry.weeklyPoints;
      case 'monthly':
        return entry.monthlyPoints;
      case 'yearly':
        return entry.yearlyPoints;
      default:
        return entry.points;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-700';
    }
  };

  const filteredEntries = leaderboardData?.entries
    .filter(entry => 
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.region.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(entry => {
      if (filters.scope === 'global') return true;
      if (filters.scope === 'regional' && filters.region) {
        return entry.region === filters.region;
      }
      if (filters.scope === 'country' && filters.country) {
        return entry.country === filters.country;
      }
      return true;
    })
    .slice(0, filters.limit) || [];

  const userEntry = leaderboardData?.userEntry;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Leaderboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {leaderboardData?.totalParticipants?.toLocaleString() || 0} participants
            </p>
          </div>
        </div>
        <button
          onClick={loadLeaderboard}
          disabled={isLoading}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Time Frame Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={filters.timeFrame}
                onChange={(e) => handleFilterChange('timeFrame', e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="all-time">All Time</option>
              </select>
            </div>

            {/* Scope Filter */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={filters.scope}
                onChange={(e) => handleFilterChange('scope', e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="global">Global</option>
                <option value="regional">Regional</option>
                <option value="country">Country</option>
              </select>
            </div>

            {/* Region Filter */}
            {filters.scope === 'regional' && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.region || ''}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Country Filter */}
            {filters.scope === 'country' && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.country || ''}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* User's Current Position */}
      {showUserHighlight && userEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {userEntry.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold">Your Position</h3>
                <p className="text-white/80">
                  Rank #{userEntry.rank} • {getPointsForTimeFrame(userEntry)} points
                </p>
                <p className="text-sm text-white/60">
                  Level {userEntry.level} • {userEntry.badge} • {userEntry.streak} day streak
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {getPointsForTimeFrame(userEntry).toLocaleString()}
              </div>
              <div className="text-sm text-white/80">
                {filters.timeFrame} points
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  entry.userId === 'current-user' ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 h-12 flex items-center justify-center">
                      {entry.rank <= 3 ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankColor(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-500">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {entry.userName}
                          {entry.userId === 'current-user' && (
                            <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.region} • Level {entry.level} • {entry.badge}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {getPointsForTimeFrame(entry).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {filters.timeFrame} points
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-500">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{entry.streak}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        day streak
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{leaderboardData?.totalParticipants?.toLocaleString() || 0} participants</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Updated {leaderboardData?.lastUpdated ? new Date(leaderboardData.lastUpdated).toLocaleTimeString() : 'never'}</span>
            </div>
          </div>
          <div className="text-right">
            <span>Showing {filteredEntries.length} of {leaderboardData?.entries.length || 0} entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 