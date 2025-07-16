'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Star, Zap, LogOut, Settings } from 'lucide-react';

import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';
import Dashboard from '@/components/Dashboard';
import GeneratedContent from '@/components/GeneratedContent';
import QuizGenerator from '@/components/QuizGenerator';
import CourseList from '@/components/CourseList';
import MainCatalogView from '@/components/MainCatalogView';
import LessonView from '@/components/LessonView';

import type { GeneratedSection, Course, Lesson } from '@/types/api';
import { PromptChain } from '@/components/promptchaining';
import { useAuth } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { mockCourses, getCourseById, getLessonById } from '@/data/courses';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatbotCollapsed, setIsChatbotCollapsed] = useState(false);

  // Auth
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // AI Generation State
  const [generatedSections, setGeneratedSections] = useState<GeneratedSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPromptChain, setCurrentPromptChain] = useState<PromptChain | undefined>(undefined);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  // Navigation
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Auth Redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNewGeneratedContent = (sections: GeneratedSection[]) => {
    setGeneratedSections(sections);
  };

  const handleGeneratingStateChange = (isGen: boolean) => {
    setIsGenerating(isGen);
  };

  const handleChainUpdate = (chain: PromptChain) => {
    setCurrentPromptChain(chain);
  };

  const handlePromptUpdate = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    if (section !== 'lesson') {
      setSelectedCourse(null);
      setSelectedLesson(null);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const course = getCourseById(courseId);
    if (course) {
      setSelectedCourse(course);
      const firstLesson = course.lessons.find(lesson => lesson.order === 1);
      if (firstLesson) {
        setSelectedLesson(firstLesson);
        setCurrentSection('lesson');
      }
    }
  };

  const handleLessonSelect = (courseId: string, lessonId: string) => {
    const course = getCourseById(courseId);
    const lesson = getLessonById(courseId, lessonId);
    if (course && lesson) {
      setSelectedCourse(course);
      setSelectedLesson(lesson);
      setCurrentSection('lesson');
    }
  };

  const handleNextLesson = () => {
    if (!selectedCourse || !selectedLesson) return;
    const index = selectedCourse.lessons.findIndex(l => l.id === selectedLesson.id);
    const next = selectedCourse.lessons[index + 1];
    if (next) setSelectedLesson(next);
  };

  const handlePreviousLesson = () => {
    if (!selectedCourse || !selectedLesson) return;
    const index = selectedCourse.lessons.findIndex(l => l.id === selectedLesson.id);
    const prev = selectedCourse.lessons[index - 1];
    if (prev) setSelectedLesson(prev);
  };

  const handleLessonComplete = (lessonId: string) => {
    console.log('Lesson completed:', lessonId);
  };

  const handleBackToCatalog = () => {
    setCurrentSection('catalog');
    setSelectedLesson(null);
  };

  const getCombinedContent = () => {
    return generatedSections.map(section => section.content).join('\n\n');
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case 'catalog':
        return <MainCatalogView courses={mockCourses} onCourseSelect={handleCourseSelect} />;
      case 'lesson':
        if (!selectedCourse || !selectedLesson) return <div>Loading...</div>;
        const currentIndex = selectedCourse.lessons.findIndex(l => l.id === selectedLesson.id);
        return (
          <LessonView
            course={selectedCourse}
            lesson={selectedLesson}
            onNextLesson={handleNextLesson}
            onPreviousLesson={handlePreviousLesson}
            onBackToCatalog={handleBackToCatalog}
            hasNext={currentIndex < selectedCourse.lessons.length - 1}
            hasPrevious={currentIndex > 0}
            onLessonComplete={handleLessonComplete}
          />
        );
      case 'dashboard':
      default:
        return (
          <>
            <GeneratedContent
              sections={generatedSections}
              isGenerating={isGenerating}
              promptChain={currentPromptChain}
            />
            {generatedSections.length > 0 && (
              <QuizGenerator
                prompt={currentPrompt || generatedSections[0]?.title || 'Generated Content'}
                generatedContent={getCombinedContent()}
                isVisible={!isGenerating}
              />
            )}
            <Dashboard />
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading BrainStrata...</h2>
          <p className="text-white/60">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex relative overflow-hidden">
      {/* Background */}
      {/* ...Background Effects... */}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-54 bg-white backdrop-blur-2xl z-50 border-r border-white/30 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/30">
              <h2 className="text-base font-bold text-black">Navigation</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 hover:bg-white/30 rounded-lg">
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <Sidebar
              onNavigate={handleNavigate}
              currentSection={currentSection}
              selectedCourse={selectedCourse}
              onLessonSelect={handleLessonSelect}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-white/30 shadow-lg">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg">
            <Menu className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-base font-bold text-white">BrainStrata</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-2 rounded-lg">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
            </button>
            <button onClick={() => router.push('/settings')}>
              <Settings className="w-4 h-4 text-white" />
            </button>
            <button onClick={handleLogout} className="text-white text-sm">Logout</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 h-full lg:flex">
          <div className={`hidden lg:block ${isSidebarCollapsed ? 'w-12' : 'w-48'}`} />
          <div className="flex-1 h-full overflow-auto">
            {renderMainContent()}
          </div>
          <div className={`hidden lg:block ${isChatbotCollapsed ? 'w-12' : 'w-56'}`} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 z-20">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onNavigate={handleNavigate}
          currentSection={currentSection}
          selectedCourse={selectedCourse}
          onLessonSelect={handleLessonSelect}
        />
      </div>

      {/* Chatbot */}
      <div className="hidden lg:block fixed top-0 right-0 z-20">
        <Chatbot
          isCollapsed={isChatbotCollapsed}
          setIsCollapsed={setIsChatbotCollapsed}
          onNewGeneratedContent={handleNewGeneratedContent}
          onGeneratingStateChange={handleGeneratingStateChange}
          onChainUpdate={handleChainUpdate}
          onPromptUpdate={handlePromptUpdate}
        />
      </div>

      {/* Mobile Chatbot */}
      {isChatOpen && (
        <div className="lg:hidden fixed inset-0 bg-white backdrop-blur-2xl z-40">
          <div className="flex items-center justify-between p-4 border-b border-white/30">
            <h2 className="text-base font-bold text-black">AI Assistant</h2>
            <button onClick={() => setIsChatOpen(false)} className="p-1.5 rounded-lg">
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <Chatbot
            onNewGeneratedContent={handleNewGeneratedContent}
            onGeneratingStateChange={handleGeneratingStateChange}
            onChainUpdate={handleChainUpdate}
            onPromptUpdate={handlePromptUpdate}
          />
        </div>
      )}
    </div>
  );
}
