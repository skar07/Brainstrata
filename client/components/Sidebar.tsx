'use client';

import { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  Calendar,
  MessageCircle,
  Bell,
  Search,
  Sparkles,
  Star,
  Zap,
  Target
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed }: SidebarProps = {}) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  
  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed ?? setInternalIsCollapsed;
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      active: true,
      color: 'from-blue-500 to-cyan-500',
      notifications: 0,
    },
    {
      icon: BookOpen,
      label: 'Courses',
      active: false,
      color: 'from-purple-500 to-pink-500',
      notifications: 3,
    },
    {
      icon: Users,
      label: 'Community',
      active: false,
      color: 'from-green-500 to-emerald-500',
      notifications: 12,
    },
    {
      icon: Award,
      label: 'Achievements',
      active: false,
      color: 'from-amber-500 to-orange-500',
      notifications: 1,
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      active: false,
      color: 'from-indigo-500 to-purple-500',
      notifications: 0,
    },
    {
      icon: Calendar,
      label: 'Schedule',
      active: false,
      color: 'from-pink-500 to-rose-500',
      notifications: 2,
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      active: false,
      color: 'from-teal-500 to-cyan-500',
      notifications: 5,
    },
    {
      icon: Settings,
      label: 'Settings',
      active: false,
      color: 'from-slate-500 to-gray-600',
      notifications: 0,
    },
  ];

  const quickActions = [
    { icon: Search, label: 'Search', color: 'from-violet-500 to-purple-500' },
    { icon: Bell, label: 'Notifications', color: 'from-yellow-500 to-orange-500' },
    { icon: Star, label: 'Favorites', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className={`bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 ${isCollapsed ? 'w-14' : 'w-54'} h-screen flex flex-col transition-all duration-300 ease-in-out relative shadow-2xl border-r border-white/10`}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-24 right-4 text-white/10 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-32 left-4 text-white/10 animate-pulse animation-delay-4000">
          <Zap className="w-3 h-3" />
        </div>
      </div>

      {/* Header - Clickable Logo */}
      <div className={`p-4 border-b border-white/10 relative z-10 ${isCollapsed ? 'px-3' : ''}`}>
        <div 
          className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} cursor-pointer hover:scale-105 transition-all duration-300`}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse hover:shadow-xl hover:from-purple-600 hover:via-pink-600 hover:to-violet-700 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                BrainStrata
              </h1>
              <p className="text-xs text-white/60 font-medium">Learning Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-3 relative z-10">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/40" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-white placeholder-white/40 text-xs"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-3 mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`flex-1 p-2 bg-gradient-to-r ${action.color} rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                title={action.label}
              >
                <action.icon className="w-3 h-3 text-white mx-auto group-hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-3 relative z-10">
        <div className="mb-4">
          <h2 className={`text-xs font-bold text-white/60 mb-3 uppercase tracking-wider ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? 'M' : 'Main Menu'}
          </h2>
          <nav className="space-y-1.5">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  item.active
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50 shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {/* Hover effect background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg`} />
                
                {/* Icon container */}
                <div className={`w-5 h-5 flex items-center justify-center rounded transition-all duration-300 ${
                  item.active 
                    ? `bg-gradient-to-r ${item.color} shadow-lg` 
                    : 'group-hover:bg-white/20'
                }`}>
                  <item.icon className={`w-3 h-3 transition-all duration-300 ${
                    item.active 
                      ? 'text-white' 
                      : 'text-white/70 group-hover:text-white group-hover:scale-110'
                  }`} />
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                    {item.notifications > 0 && (
                      <span className={`w-6 h-6 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse`}>
                        {item.notifications > 9 ? '9+' : item.notifications}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === index && (
                  <div className="absolute left-16 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl z-50 whitespace-nowrap border border-white/20">
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

      {/* Enhanced User Profile */}
      <div className={`p-4 border-t border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm relative z-10 ${isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">JD</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">John Doe</h3>
              <p className="text-white/60 text-xs">Premium Member</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-white/60 mt-1">Level 12</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">JD</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {!isCollapsed && (
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-xs font-medium">Weekly Goal</span>
            <span className="text-white/70 text-xs font-medium">7/10 hrs</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-sm" style={{ width: '70%' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}