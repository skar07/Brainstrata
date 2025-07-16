'use client';

import React, { useState } from 'react';
import { Course } from '@/types/api';
import { BookOpen, Clock, Users, ChevronDown, ChevronUp, Play, Award, TrendingUp } from 'lucide-react';

interface CompactCatalogProps {
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  onViewAllClick: () => void;
  selectedCourse?: Course | null;
  onLessonSelect?: (courseId: string, lessonId: string) => void;
}

export default function CompactCatalog({ 
  courses, 
  onCourseSelect, 
  onViewAllClick, 
  selectedCourse,
  onLessonSelect 
}: CompactCatalogProps) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  // Get compact courses - only show 3 most relevant courses
  const priorityCourses = courses
    .filter(course => course.progress && course.progress > 0) // In-progress courses first
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 2);
  
  const newCourses = courses
    .filter(course => !course.progress || course.progress === 0)
    .slice(0, 1);
  
  const featuredCourses = [...priorityCourses, ...newCourses];
  
  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-500';
      case 'Intermediate': return 'from-amber-500 to-orange-500';
      case 'Advanced': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3 h-3 text-purple-400" />
          <h3 className="text-xs font-semibold text-white/80">
            Learning Path
          </h3>
        </div>
        <button
          onClick={onViewAllClick}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 rounded hover:bg-white/10"
        >
          View All
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            <span className="text-white text-xs font-medium">
              {Math.round(courses.reduce((acc, course) => acc + (course.progress || 0), 0) / courses.length)}%
            </span>
          </div>
          <p className="text-white/60 text-xs">Progress</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            <span className="text-white text-xs font-medium">
              {courses.filter(c => c.progress && c.progress > 0).length}
            </span>
          </div>
          <p className="text-white/60 text-xs">Active</p>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="space-y-2">
        {featuredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
          >
            {/* Course Header */}
            <div className="p-2">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-5 h-5 bg-gradient-to-br ${course.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-xs font-medium truncate">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" />
                      {course.lessons.length}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleCourseExpansion(course.id)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  {expandedCourse === course.id ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {course.progress !== undefined && course.progress > 0 && (
                <div className="mb-2">
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div 
                      className={`bg-gradient-to-r ${course.color} h-1 rounded-full transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {course.progress}% Complete
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onCourseSelect(course.id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-gradient-to-r ${course.color} rounded text-white text-xs font-medium hover:shadow-md transition-all duration-300`}
                >
                  <Play className="w-2.5 h-2.5" />
                  {course.progress && course.progress > 0 ? 'Continue' : 'Start'}
                </button>
                <div className={`px-2 py-1 bg-gradient-to-r ${getDifficultyColor(course.difficulty)} rounded text-white text-xs flex-shrink-0`}>
                  {course.difficulty.charAt(0)}
                </div>
              </div>
            </div>

            {/* Lessons Dropdown */}
            {expandedCourse === course.id && (
              <div className="px-2 pb-2 border-t border-white/10">
                <div className="mt-2 space-y-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {course.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonSelect?.(course.id, lesson.id)}
                      className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex items-center justify-center ${
                          lesson.completed 
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
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        onClick={onViewAllClick}
        className="w-full py-2 text-xs text-white/60 hover:text-white transition-colors border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5"
      >
        Browse All {courses.length} Courses
      </button>
    </div>
  );
} 