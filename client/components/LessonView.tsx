'use client';

import React from 'react';
import { Course, Lesson } from '@/types/api';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, PlayCircle, BookOpen, ArrowLeft } from 'lucide-react';

interface LessonViewProps {
  course: Course;
  lesson: Lesson;
  onNextLesson: () => void;
  onPreviousLesson: () => void;
  onBackToCatalog: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  onLessonComplete: (lessonId: string) => void;
}

export default function LessonView({
  course,
  lesson,
  onNextLesson,
  onPreviousLesson,
  onBackToCatalog,
  hasNext,
  hasPrevious,
  onLessonComplete
}: LessonViewProps) {
  const currentLessonIndex = course.lessons.findIndex(l => l.id === lesson.id);
  const completedLessons = course.lessons.filter(l => l.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            <p className="text-white/70">{course.category} • {course.difficulty}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between text-sm text-white/70 mb-2">
            <span>Course Progress</span>
            <span>{completedLessons}/{course.lessons.length} lessons completed</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${(completedLessons / course.lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          {/* Lesson Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/60 text-sm">
                    Lesson {currentLessonIndex + 1} of {course.lessons.length}
                  </span>
                  {lesson.completed && (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </div>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{lesson.title}</h2>
                <p className="text-white/70 text-lg">{lesson.description}</p>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{lesson.duration}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {!lesson.completed && (
                <button
                  onClick={() => onLessonComplete(lesson.id)}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${course.color} rounded-lg text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Lesson
                </button>
              )}
              {lesson.completed && (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Lesson Completed
                </div>
              )}
            </div>
          </div>

          {/* Lesson Content */}
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-white/80 leading-relaxed text-lg">
                {lesson.content || 'Lesson content will be loaded here...'}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-white/20 bg-white/5">
            <div className="flex items-center justify-between">
              <button
                onClick={onPreviousLesson}
                disabled={!hasPrevious}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  hasPrevious
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                    : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Lesson
              </button>

              <div className="flex items-center gap-2">
                {course.lessons.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentLessonIndex
                        ? `bg-gradient-to-r ${course.color} shadow-lg`
                        : index < currentLessonIndex
                        ? 'bg-green-500'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={onNextLesson}
                disabled={!hasNext}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  hasNext
                    ? `bg-gradient-to-r ${course.color} text-white shadow-lg hover:shadow-xl hover:scale-105`
                    : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
                }`}
              >
                Next Lesson
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Notes (Optional Enhancement) */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Lesson Notes</h3>
          <textarea
            placeholder="Take notes for this lesson..."
            className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none"
          />
        </div>
      </div>
    </div>
  );
} 