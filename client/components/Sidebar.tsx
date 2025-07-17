'use client';

import React, { useState } from 'react';

import {
  Home,
  BookOpen,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Award,
  TrendingUp,
  Calendar,
  MessageCircle,
  Bell,
  Search,
  Sparkles,
  Star,
  Zap,
  Target,
  LogOut,
  Power
} from 'lucide-react';

import { useAuth } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { mockCourses } from '@/data/courses';
import type { Course } from '@/types/api';
import CompactCatalog from './CompactCatalog';
import RoadmapGenerator from './RoadmapGenerator';

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  onNavigate?: (section: string) => void;
  currentSection?: string;
  selectedCourse?: Course | null;
  onLessonSelect?: (courseId: string, lessonId: string) => void;
}

export default function Sidebar({
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
  onNavigate = () => { },
  currentSection = 'dashboard',
  selectedCourse,
  onLessonSelect
}: SidebarProps = {}) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed ?? setInternalIsCollapsed;
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Add this state for the learning path section
  const [isCatalogCollapsed, setIsCatalogCollapsed] = useState(false);
  // Get featured courses (first 3 with some progress or newest)
  const featuredCourses = mockCourses.slice(0, 3);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleMenuClick = (item: any, index: number) => {
    if (item.label === 'Settings') {
      router.push('/settings');
    } else {
      item.onClick?.();
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    logout();
    setIsLoggingOut(false);
  };

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      active: currentSection === 'dashboard',
      color: 'from-blue-500 to-cyan-500',
      notifications: 0,
      onClick: () => onNavigate('dashboard')
    },
    {
      icon: BookOpen,
      label: 'Catalog',
      active: currentSection === 'catalog',
      color: 'from-purple-500 to-pink-500',
      notifications: 3,
      onClick: () => onNavigate('catalog')
    },
    {
      icon: Users,
      label: 'Community',
      active: false,
      color: 'from-green-500 to-emerald-500',
      notifications: 12,
      onClick: () => onNavigate('community')
    },
    {
      icon: Award,
      label: 'Roadmap',
      active: false,
      color: 'from-amber-500 to-orange-500',
      notifications: 1,
      onClick: () => onNavigate('achievements')
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      active: false,
      color: 'from-indigo-500 to-purple-500',
      notifications: 0,
      onClick: () => onNavigate('progress')
    },
    {
      icon: Calendar,
      label: 'Schedule',
      active: false,
      color: 'from-pink-500 to-rose-500',
      notifications: 2,
      onClick: () => onNavigate('schedule')
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      active: false,
      color: 'from-teal-500 to-cyan-500',
      notifications: 5,
      onClick: () => onNavigate('messages')
    },
    {
      icon: Settings,
      label: 'Settings',
      active: false,
      color: 'from-slate-500 to-gray-600',
      notifications: 0,
      onClick: () => onNavigate('settings')
    }
  ];

  const quickActions = [
    { icon: Search, label: 'Search', color: 'from-violet-500 to-purple-500' },
    { icon: Bell, label: 'Notifications', color: 'from-yellow-500 to-orange-500' },
    { icon: Star, label: 'Favorites', color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className={`bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 ${isCollapsed ? 'w-12' : 'w-48'} h-screen flex flex-col transition-all duration-300 ease-in-out relative shadow-2xl border-r border-white/10`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>

        {/* Floating Sparkles */}
        <div className="absolute top-24 right-4 text-white/10 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-28 left-3 text-white/10 animate-pulse animation-delay-4000">
          <Zap className="w-2 h-2" />
        </div>
      </div>

      {/* Header - Clickable Logo */}
      <div className={`p-4 border-b border-white/10 relative z-10 ${isCollapsed ? 'px-3' : ''}`}>
        <div
          className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} cursor-pointer hover:scale-105 transition-all duration-300`}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                BrainStrata
              </h1>
              <p className="text-xs text-white/60 font-medium">Learning Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-2 relative z-10">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/40" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-xs placeholder-white/40"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-2 mb-2 relative z-10">
          <div className="flex items-center gap-1">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`flex-1 p-1.5 bg-gradient-to-r ${action.color} rounded-lg hover:scale-105 transition-all duration-300`}
                title={action.label}
              >
                <action.icon className="w-3 h-3 text-white mx-auto" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lessons or Catalog */}
      {!isCollapsed && selectedCourse && currentSection === 'lesson' ? (
        <div className="px-3 mb-4 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-6 h-6 bg-gradient-to-br ${selectedCourse.color} rounded-lg flex items-center justify-center shadow-lg`}>
              <BookOpen className="w-3 h-3 text-white" />
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Progress</span>
                <span>{selectedCourse.lessons.filter((l: any) => l.completed).length}/{selectedCourse.lessons.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1">
                <div
                  className={`bg-gradient-to-r ${selectedCourse.color} h-1 rounded-full transition-all duration-500`}
                  style={{ width: `${selectedCourse.progress || 0}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              All
            </button>
          </div>

          {/* Lessons Roadmap */}
          <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {selectedCourse.lessons.map((lesson: any, index: number) => (
              <button
                key={lesson.id}
                onClick={() => onLessonSelect?.(selectedCourse.id, lesson.id)}
                className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${lesson.completed
                      ? 'bg-green-500'
                      : 'bg-white/20 border border-white/30'
                    }`}>
                    {lesson.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-xs text-white/80 group-hover:text-white truncate">
                    {lesson.order}. {lesson.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        !isCollapsed && (
          <div className="px-3 mb-4 relative z-10">
            {/* Learning Path Section */}
            <div className="mb-4">
              {/* Toggle header */}
              <button
                onClick={() => setIsCatalogCollapsed(!isCatalogCollapsed)}
                className="w-full flex items-center justify-between text-xs text-white/70 hover:text-white bg-white/5 p-2 rounded transition"
              >
                <span>Learning Path</span>
                {isCatalogCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>

              {/* Collapsible content */}
              {!isCatalogCollapsed && (
                <div className="mt-2 transition-all duration-300">
                  <CompactCatalog
                    courses={mockCourses}
                    selectedCourse={selectedCourse}
                    onCourseSelect={(courseId) => {
                      const course = mockCourses.find(c => c.id === courseId);
                      if (course && course.lessons.length > 0) {
                        onLessonSelect?.(courseId, course.lessons[0].id);
                      }
                    }}
                    onLessonSelect={onLessonSelect}
                    onViewAllClick={() => onNavigate?.('catalog')}
                  />
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-3 relative z-10">
        <div className="mb-4">
          <h2 className={`text-xs font-bold text-white/60 mb-3 uppercase tracking-wider ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? 'M' : 'Main Menu'}
          </h2>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item, index)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${item.active
    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50 shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {/* Hover effect background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg`} />

                {/* Icon container */}
                <div className={`w-5 h-5 flex items-center justify-center rounded transition-all duration-300 ${item.active
                    ? `bg-gradient-to-r ${item.color} shadow-lg`
                    : 'group-hover:bg-white/20'
                  }`}>
                  <item.icon className={`w-3 h-3 transition-all duration-300 ${item.active
                      ? 'text-white'
                      : 'text-white/70 group-hover:text-white group-hover:scale-110'
                    }`} />
                </div>

                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm">{item.label}</span>
                    {item.notifications > 0 && (
                      <span className={`w-5 h-5 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-xs text-white shadow-lg`}>
                        {item.notifications > 9 ? '9+' : item.notifications}
                      </span>
                    )}
                  </>
                )}
                {isCollapsed && hoveredItem === index && (
                  <div className="absolute left-14 bg-gray-900 text-white text-sm px-2 py-1 rounded-lg shadow-xl z-50">
                    {item.label}
                    {item.notifications > 0 && (
                      <span className="ml-2 text-purple-400">({item.notifications})</span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className={`p-2 border-t border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm relative z-10 ${isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{user?.name || 'User'}</h3>
                <p className="text-white/60 text-xs">Premium Member</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-white/60 mt-1">Level 12</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 hover:border-red-400/50 hover:text-red-200"
            >
              <div className="w-4 h-4 flex items-center justify-center bg-red-500/20">
                {isLoggingOut ? (
                  <div className="animate-spin h-3 w-3 border-b-2 border-red-300 rounded-full" />
                ) : (
                  <LogOut className="w-3 h-3" />
                )}
              </div>
              <span className="flex-1 text-sm">{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
              <Power className="w-3 h-3 opacity-60" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 hover:border-red-400/50 hover:text-red-200"
              title="Sign Out"
            >
              {isLoggingOut ? (
                <div className="animate-spin h-3 w-3 border-b-2 border-red-300 rounded-full" />
              ) : (
                <LogOut className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Expand/Collapse Control */}
      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
        </button>
      </div>
    </div>
  );
}
