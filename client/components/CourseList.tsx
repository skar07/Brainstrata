'use client';

import React from 'react';
import { Course } from '@/types/api';
import { BookOpen, Clock, BarChart3, Users, Star, Play, CheckCircle } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
}

export default function CourseList({ courses, onCourseSelect }: CourseListProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent mb-4">
          Course Catalog
        </h1>
        <p className="text-white/70 text-lg">
          Discover and start your learning journey with our comprehensive courses
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const IconComponent = getCategoryIcon(course.category);
          const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
          const totalLessons = course.lessons.length;
          
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
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
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

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-2">{courses.length}</h3>
          <p className="text-white/70">Total Courses</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-2">
            {courses.reduce((acc, course) => acc + course.lessons.length, 0)}
          </h3>
          <p className="text-white/70">Total Lessons</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-2">
            {Math.round(courses.reduce((acc, course) => acc + (course.progress || 0), 0) / courses.length)}%
          </h3>
          <p className="text-white/70">Average Progress</p>
        </div>
      </div>
    </div>
  );
} 