'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Eye,
  Calendar,
  Plus,
  Search,
  Bell,
  Settings,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Brain,
  Sparkles,
  Globe,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  ThumbsUp,
  MessageCircle,
  Send,
  Image,
  Video,
  Mic,
  Link,
  Hash,
  AtSign,
  Bookmark,
  Flag,
  Shield,
  Cpu,
  Activity,
  PieChart,
  LineChart,
  Camera,
  Monitor,
  Smartphone,
  Hexagon,
  Square,
  Circle,
  BookOpen,
  Award,
  Trophy,
  GraduationCap,
  Timer,
  Flame,
  UserCheck,
  TrendingDown,
  BarChart2,
  Calculator,
  Atom,
  Code
} from 'lucide-react';
import { useAuth } from '@/lib/stores/authStore';

// Learning-focused interfaces
interface LearningMetric {
  subject: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  hoursCompleted: number;
  progress: number;
  improvement: number;
  coursesCompleted: number;
  skillLevel: number;
}

interface LearningActivity {
  id: string;
  type: 'course' | 'quiz' | 'project' | 'assignment';
  title: string;
  subject: string;
  status: 'completed' | 'in-progress' | 'pending';
  score?: number;
  timeSpent: number;
  completedAt?: string;
  dueDate?: string;
}

interface LeadershipMetric {
  id: string;
  name: string;
  score: number;
  improvement: number;
  rank: number;
  category: string;
  avatar: string;
}

interface ImprovementData {
  date: string;
  overallScore: number;
  mathScore: number;
  scienceScore: number;
  languageScore: number;
  programmingScore: number;
  studyTime: number;
}

const ModernDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'progress' | 'leadership'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Learning metrics data
  const learningMetrics: LearningMetric[] = [
    {
      subject: 'Mathematics',
      icon: Calculator,
      color: 'text-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      hoursCompleted: 45,
      progress: 78,
      improvement: 12.5,
      coursesCompleted: 3,
      skillLevel: 4.2
    },
    {
      subject: 'Science',
      icon: Atom,
      color: 'text-green-500',
      gradient: 'from-green-500 to-green-600',
      hoursCompleted: 38,
      progress: 65,
      improvement: 8.3,
      coursesCompleted: 2,
      skillLevel: 3.8
    },
    {
      subject: 'Programming',
      icon: Code,
      color: 'text-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      hoursCompleted: 67,
      progress: 89,
      improvement: 25.2,
      coursesCompleted: 4,
      skillLevel: 4.7
    },
    {
      subject: 'Language Arts',
      icon: BookOpen,
      color: 'text-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      hoursCompleted: 29,
      progress: 54,
      improvement: 7.1,
      coursesCompleted: 2,
      skillLevel: 3.5
    },
    {
      subject: 'History',
      icon: Globe,
      color: 'text-red-500',
      gradient: 'from-red-500 to-red-600',
      hoursCompleted: 23,
      progress: 41,
      improvement: 15.8,
      coursesCompleted: 1,
      skillLevel: 3.2
    }
  ];

  // Recent learning activities
  const recentActivities: LearningActivity[] = [
    {
      id: '1',
      type: 'course',
      title: 'Advanced React Patterns',
      subject: 'Programming',
      status: 'completed',
      score: 94,
      timeSpent: 3.5,
      completedAt: '2 hours ago'
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Calculus Fundamentals Quiz',
      subject: 'Mathematics',
      status: 'completed',
      score: 87,
      timeSpent: 0.5,
      completedAt: '1 day ago'
    },
    {
      id: '3',
      type: 'project',
      title: 'Machine Learning Project',
      subject: 'Programming',
      status: 'in-progress',
      timeSpent: 8.2,
      dueDate: 'Tomorrow'
    },
    {
      id: '4',
      type: 'assignment',
      title: 'World War II Essay',
      subject: 'History',
      status: 'pending',
      timeSpent: 0,
      dueDate: 'In 3 days'
    }
  ];

  // Leadership board data
  const leadershipData: LeadershipMetric[] = [
    {
      id: '1',
      name: user?.name || 'You',
      score: 1847,
      improvement: 12.5,
      rank: 1,
      category: 'Overall',
      avatar: user?.name?.charAt(0) || 'U'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      score: 1823,
      improvement: 8.3,
      rank: 2,
      category: 'Overall',
      avatar: 'S'
    },
    {
      id: '3',
      name: 'Mike Chen',
      score: 1799,
      improvement: 15.7,
      rank: 3,
      category: 'Overall',
      avatar: 'M'
    },
    {
      id: '4',
      name: 'Emma Davis',
      score: 1776,
      improvement: 5.2,
      rank: 4,
      category: 'Overall',
      avatar: 'E'
    },
    {
      id: '5',
      name: 'Alex Rodriguez',
      score: 1752,
      improvement: 22.1,
      rank: 5,
      category: 'Overall',
      avatar: 'A'
    }
  ];

  // Improvement data for simple charts
  const improvementData: ImprovementData[] = [
    { date: '2024-01-01', overallScore: 65, mathScore: 70, scienceScore: 60, languageScore: 65, programmingScore: 75, studyTime: 2.5 },
    { date: '2024-01-08', overallScore: 68, mathScore: 72, scienceScore: 64, languageScore: 67, programmingScore: 78, studyTime: 3.2 },
    { date: '2024-01-15', overallScore: 71, mathScore: 75, scienceScore: 68, languageScore: 69, programmingScore: 82, studyTime: 3.8 },
    { date: '2024-01-22', overallScore: 74, mathScore: 78, scienceScore: 72, languageScore: 71, programmingScore: 85, studyTime: 4.1 },
    { date: '2024-01-29', overallScore: 77, mathScore: 81, scienceScore: 75, languageScore: 74, programmingScore: 88, studyTime: 4.5 },
    { date: '2024-02-05', overallScore: 80, mathScore: 84, scienceScore: 78, languageScore: 77, programmingScore: 91, studyTime: 5.0 },
    { date: '2024-02-12', overallScore: 83, mathScore: 87, scienceScore: 81, languageScore: 80, programmingScore: 94, studyTime: 5.3 }
  ];

  // Pie chart data for learning categories
  const learningCategoryData = [
    { name: 'Programming', value: 35, color: 'bg-purple-500' },
    { name: 'Mathematics', value: 25, color: 'bg-blue-500' },
    { name: 'Science', value: 20, color: 'bg-green-500' },
    { name: 'Language Arts', value: 12, color: 'bg-orange-500' },
    { name: 'History', value: 8, color: 'bg-red-500' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'quiz': return Brain;
      case 'project': return Target;
      case 'assignment': return MessageSquare;
      default: return BookOpen;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/30 bg-green-500/10';
      case 'in-progress': return 'border-blue-500/30 bg-blue-500/10';
      case 'pending': return 'border-yellow-500/30 bg-yellow-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Simple bar chart component
  const SimpleBarChart = ({ data, title }: { data: any[]; title: string }) => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</span>
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${item.gradient || 'from-purple-500 to-pink-500'} transition-all duration-700 ease-out shadow-sm`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Simple pie chart component
  const SimplePieChart = ({ data, title }: { data: any[]; title: string }) => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full ${item.color} shadow-sm group-hover:scale-110 transition-transform`}></div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{item.name}</span>
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Simple line chart component
  const SimpleLineChart = ({ data, title }: { data: any[]; title: string }) => {
    const maxScore = Math.max(...data.map(d => d.overallScore));
    const minScore = Math.min(...data.map(d => d.overallScore));
    const scoreRange = maxScore - minScore;
    
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 relative">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-6 bottom-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{maxScore}</span>
            <span>{Math.round((maxScore + minScore) / 2)}</span>
            <span>{minScore}</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-8 h-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="20" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gray-300 dark:text-gray-600"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Line path */}
              <path
                d={`M ${data.map((item, index) => 
                  `${(index / (data.length - 1)) * 100},${100 - ((item.overallScore - minScore) / scoreRange * 80 + 10)}`
                ).join(' L ')}`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              
              {/* Data points */}
              {data.map((item, index) => (
                <circle
                  key={index}
                  cx={(index / (data.length - 1)) * 100}
                  cy={100 - ((item.overallScore - minScore) / scoreRange * 80 + 10)}
                  r="2"
                  fill="white"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
              ))}
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              {data.map((item, index) => (
                <span key={index} className="text-center">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Overall Score</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            Current: {data[data.length - 1].overallScore}%
          </div>
          <div className="text-green-500 font-medium">
            +{data[data.length - 1].overallScore - data[0].overallScore} points
          </div>
        </div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Top Navigation */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">LearningHub AI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Smart Learning Dashboard</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses, topics, assignments..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'User'}! 🎓
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your learning progress and achievements
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: LineChart },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'leadership', label: 'Leadership', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-purple-600 dark:text-purple-400'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Learning Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        18.5%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningMetrics.reduce((sum, metric) => sum + metric.hoursCompleted, 0)}h
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Study Time</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        12.3%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {learningMetrics.reduce((sum, metric) => sum + metric.coursesCompleted, 0)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Courses Completed</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        8.7%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(learningMetrics.reduce((sum, metric) => sum + metric.progress, 0) / learningMetrics.length)}%
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Progress</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        15.2%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(learningMetrics.reduce((sum, metric) => sum + metric.skillLevel, 0) / learningMetrics.length).toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Skill Level</p>
                    </div>
                  </motion.div>
                </div>

                {/* Learning Categories Distribution */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Distribution</h3>
                    <PieChart className="w-5 h-5 text-gray-500" />
                  </div>
                  <SimplePieChart data={learningCategoryData} title="Time Distribution by Subject" />
                </motion.div>

                {/* Subject Performance */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Performance</h3>
                    <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {learningMetrics.map((metric, index) => (
                      <div key={metric.subject} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${metric.gradient} rounded-lg flex items-center justify-center`}>
                              <metric.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{metric.subject}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.hoursCompleted}h completed</p>
                            </div>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.improvement > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {metric.improvement > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                            {Math.abs(metric.improvement)}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="font-medium text-gray-900 dark:text-white">{metric.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${metric.gradient}`}
                              style={{ width: `${metric.progress}%` }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Skill Level</p>
                              <p className="font-medium text-gray-900 dark:text-white">{metric.skillLevel}/5</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Courses</p>
                              <p className="font-medium text-gray-900 dark:text-white">{metric.coursesCompleted}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Learning Activities */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>New Activity</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className={`p-4 rounded-xl border-2 ${getActivityColor(activity.status)}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${
                              learningMetrics.find(m => m.subject === activity.subject)?.gradient || 'from-gray-500 to-gray-600'
                            } rounded-lg flex items-center justify-center`}>
                              {React.createElement(getActivityIcon(activity.type), { className: "w-4 h-4 text-white" })}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{activity.subject}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {activity.status === 'completed' ? activity.completedAt : activity.dueDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Timer className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500 dark:text-gray-400">{activity.timeSpent}h</span>
                            </div>
                            {activity.score && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-900 dark:text-white font-medium">{activity.score}%</span>
                              </div>
                            )}
                          </div>
                          {activity.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Improvement Analytics */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Improvement Analytics</h3>
                    <LineChart className="w-5 h-5 text-gray-500" />
                  </div>
                  <SimpleLineChart data={improvementData} title="Overall Score Improvement" />
                </motion.div>

                {/* Subject Performance Comparison */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Performance</h3>
                    <BarChart3 className="w-5 h-5 text-gray-500" />
                  </div>
                  <SimpleBarChart 
                    data={learningMetrics.map(metric => ({ 
                      name: metric.subject, 
                      value: metric.progress, 
                      gradient: metric.gradient 
                    }))} 
                    title="Progress by Subject" 
                  />
                </motion.div>

                {/* Multi-Subject Performance Over Time */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Multi-Subject Performance Trends</h3>
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-80 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-2 top-6 bottom-16 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>100</span>
                        <span>75</span>
                        <span>50</span>
                        <span>25</span>
                        <span>0</span>
                      </div>
                      
                      {/* Chart area */}
                      <div className="ml-8 h-full relative">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {/* Grid lines */}
                          <defs>
                            <pattern id="multiGrid" width="14.28" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 14.28 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gray-300 dark:text-gray-600"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#multiGrid)" />
                          
                          {/* Math Score Line */}
                          <path
                            d={`M ${improvementData.map((item, index) => 
                              `${(index / (improvementData.length - 1)) * 100},${100 - (item.mathScore)}`
                            ).join(' L ')}`}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Science Score Line */}
                          <path
                            d={`M ${improvementData.map((item, index) => 
                              `${(index / (improvementData.length - 1)) * 100},${100 - (item.scienceScore)}`
                            ).join(' L ')}`}
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Programming Score Line */}
                          <path
                            d={`M ${improvementData.map((item, index) => 
                              `${(index / (improvementData.length - 1)) * 100},${100 - (item.programmingScore)}`
                            ).join(' L ')}`}
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Language Score Line */}
                          <path
                            d={`M ${improvementData.map((item, index) => 
                              `${(index / (improvementData.length - 1)) * 100},${100 - (item.languageScore)}`
                            ).join(' L ')}`}
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Data points for each subject */}
                          {improvementData.map((item, index) => (
                            <g key={index}>
                              <circle cx={(index / (improvementData.length - 1)) * 100} cy={100 - item.mathScore} r="1.5" fill="#3B82F6" stroke="white" strokeWidth="1" />
                              <circle cx={(index / (improvementData.length - 1)) * 100} cy={100 - item.scienceScore} r="1.5" fill="#10B981" stroke="white" strokeWidth="1" />
                              <circle cx={(index / (improvementData.length - 1)) * 100} cy={100 - item.programmingScore} r="1.5" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                              <circle cx={(index / (improvementData.length - 1)) * 100} cy={100 - item.languageScore} r="1.5" fill="#F59E0B" stroke="white" strokeWidth="1" />
                            </g>
                          ))}
                        </svg>
                        
                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {improvementData.map((item, index) => (
                            <span key={index} className="text-center">
                              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Multi-line Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-blue-500 rounded"></div>
                        <span className="text-gray-600 dark:text-gray-400">Mathematics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-green-500 rounded"></div>
                        <span className="text-gray-600 dark:text-gray-400">Science</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-purple-500 rounded"></div>
                        <span className="text-gray-600 dark:text-gray-400">Programming</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-yellow-500 rounded"></div>
                        <span className="text-gray-600 dark:text-gray-400">Language Arts</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-8">
                {/* Skill Level Progress */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skill Level Progress</h3>
                    <Target className="w-5 h-5 text-gray-500" />
                  </div>
                  <SimpleBarChart 
                    data={learningMetrics.map(metric => ({ 
                      name: metric.subject, 
                      value: (metric.skillLevel / 5) * 100, 
                      gradient: metric.gradient 
                    }))} 
                    title="Skill Level by Subject" 
                  />
                </motion.div>

                {/* Study Time Distribution */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Time Distribution</h3>
                    <Clock className="w-5 h-5 text-gray-500" />
                  </div>
                  <SimpleBarChart 
                    data={learningMetrics.map(metric => ({ 
                      name: metric.subject, 
                      value: (metric.hoursCompleted / Math.max(...learningMetrics.map(m => m.hoursCompleted))) * 100, 
                      gradient: metric.gradient 
                    }))} 
                    title="Hours Completed by Subject" 
                  />
                </motion.div>
              </div>
            )}

            {activeTab === 'leadership' && (
              <div className="space-y-8">
                {/* Leadership Board */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Leadership Board</h3>
                      <p className="text-white/80">Top performers in learning achievements</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Leadership Rankings */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Rankings</h3>
                    <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {leadershipData.map((leader, index) => (
                      <div key={leader.id} className={`p-4 rounded-xl border-2 ${
                        leader.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' :
                        leader.rank === 2 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                        leader.rank === 3 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' :
                        'bg-gray-50 border-gray-200'
                      } dark:bg-gray-700 dark:border-gray-600`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                              leader.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                              leader.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-slate-500' :
                              leader.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                              'bg-gradient-to-r from-purple-400 to-pink-500'
                            }`}>
                              {leader.rank <= 3 ? (
                                <Trophy className="w-6 h-6" />
                              ) : (
                                leader.avatar
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{leader.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Rank #{leader.rank}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">{leader.score}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Total Score</p>
                            </div>
                            <div className={`flex items-center text-sm font-medium ${
                              leader.improvement > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {leader.improvement > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                              {Math.abs(leader.improvement)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Leadership Analytics */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leadership Analytics</h3>
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                  </div>
                  <SimpleBarChart 
                    data={leadershipData.map(leader => ({ 
                      name: leader.name, 
                      value: (leader.score / Math.max(...leadershipData.map(l => l.score))) * 100, 
                      gradient: 'from-purple-500 to-pink-500' 
                    }))} 
                    title="Leadership Score Comparison" 
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ModernDashboard; 