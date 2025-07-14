export interface GenerateRequest {
  prompt: string;
  context?: string;
  isChained?: boolean;
}

export interface PromptResponse {
  prompt: string;
  response: string;
}

export interface GenerateResponse {
  text: string; // Keep for backward compatibility
  responses?: PromptResponse[]; // New field for multiple responses
}

export interface GeneratedSection {
  id: string;
  title: string;
  prompt: string;
  content: string;
  timestamp: Date;
  chainDepth?: number;
  isChained?: boolean;
}

export interface QuizRequest {
  prompt: string;
  generatedContent: string;
  questionCount?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  totalQuestions: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: Lesson[];
  color: string; // for gradient colors
  progress?: number; // 0-100
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed?: boolean;
  content?: string;
  order: number;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  progress: number;
}