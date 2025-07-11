export interface GenerateRequest {
  prompt: string;
}

export interface PromptResponse {
  prompt: string;
  response: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface GenerateResponse {
  text: string; // Keep for backward compatibility
  responses?: PromptResponse[]; // New field for multiple responses
  quizQuestions?: QuizQuestion[]; // Add quiz questions to response
}

export interface GeneratedSection {
  id: string;
  title: string;
  prompt: string;
  content: string;
  timestamp: Date;
  quizQuestions?: QuizQuestion[]; // Add quiz questions to sections
}