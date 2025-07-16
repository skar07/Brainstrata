'use client';

import React, { useState } from 'react';
import { Course } from '@/types/api';
import { BookOpen, Clock, BarChart3, Users, Star, Play, CheckCircle, Filter, Search, Grid, List } from 'lucide-react';

interface MainCatalogViewProps {
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
}

export default function MainCatalogView({ courses, onCourseSelect }: MainCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-500';
      case 'Intermediate': return 'from-amber-500 to-orange-500';
      case 'Advanced': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technology': return BookOpen;
      case 'Business': return BarChart3;
      case 'Design': return Star;
      case 'Analytics': return BarChart3;
      case 'Security': return CheckCircle;
      default: return BookOpen;
    }
  };

  // Get unique categories and difficulties
  const categories = ['All', ...Array.from(new Set(courses.map(course => course.category)))];
  const difficulties = ['All', ...Array.from(new Set(courses.map(course => course.difficulty)))];

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return 0; // Maintain original order for newest
      case 'title':
        return a.title.localeCompare(b.title);
      case 'progress':
        return (b.progress || 0) - (a.progress || 0);
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
               difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent mb-2">
          Course Catalog
        </h1>
        <p className="text-white/70 text-lg mb-6">
          Explore our comprehensive learning pathways and start your journey
        </p>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-white placeholder-white/40"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-900 text-white">
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty} className="bg-slate-900 text-white">
                  {difficulty}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
            >
              <option value="newest" className="bg-slate-900 text-white">Newest</option>
              <option value="title" className="bg-slate-900 text-white">Title</option>
              <option value="progress" className="bg-slate-900 text-white">Progress</option>
              <option value="difficulty" className="bg-slate-900 text-white">Difficulty</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'} transition-colors`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'} transition-colors`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-white/60 text-sm">
          Showing {sortedCourses.length} of {courses.length} courses
        </div>
      </div>

      {/* Course Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {sortedCourses.map((course) => {
          const IconComponent = getCategoryIcon(course.category);
          const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
          const totalLessons = course.lessons.length;
          
          if (viewMode === 'list') {
            return (
              <div
                key={course.id}
                onClick={() => onCourseSelect(course.id)}
                className="group bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                        {course.title}
                      </h3>
                      <div className={`px-3 py-1 bg-gradient-to-r ${getDifficultyColor(course.difficulty)} rounded-full text-white text-sm font-medium`}>
                        {course.difficulty}
                      </div>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-white/60 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.category}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {course.progress !== undefined && course.progress > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/70">{course.progress}%</span>
                      </div>
                    )}
                  </div>
                  
                  <button className={`px-6 py-3 bg-gradient-to-r ${course.color} rounded-lg text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2`}>
                    <Play className="w-4 h-4" />
                    {course.progress && course.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={course.id}
              onClick={() => onCourseSelect(course.id)}
              className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
              
              {/* Course Header */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${getDifficultyColor(course.difficulty)} rounded-full text-white text-xs font-medium`}>
                    {course.difficulty}
                  </div>
                </div>

                {/* Course Title and Description */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                  {course.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.category}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {course.progress !== undefined && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                      <span>Progress</span>
                      <span>{completedLessons}/{totalLessons} completed</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {course.progress && course.progress > 0 ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-medium">In Progress</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-blue-400 text-xs font-medium">New</span>
                      </>
                    )}
                  </div>
                  <button className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${course.color} rounded-lg text-white text-sm font-medium shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                    <Play className="w-4 h-4" />
                    {course.progress && course.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-white/60">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
} 