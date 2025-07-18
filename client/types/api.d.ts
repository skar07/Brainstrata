export interface GenerateRequest {
  prompt: string;
  context?: string;
  isChained?: boolean;
  generateImage?: boolean; // New field to request image generation
  streamMode?: boolean; // New field to enable streaming responses
}

export interface PromptResponse {
  prompt: string;
  response: string;
}

export interface GenerateResponse {
  text: string; // Keep for backward compatibility
  responses?: PromptResponse[]; // New field for multiple responses
  imageUrl?: string; // New field for generated image URL
}

export interface GeneratedSection {
  id: string;
  title: string;
  prompt: string;
  content: string;
  timestamp: Date;
  chainDepth?: number;
  isChained?: boolean;
  imageUrl?: string; // New field for section-specific images
  hasImageContext?: boolean; // New field to indicate if section has image context
  imageAnalysis?: string; // New field to store image analysis for the section
}

// Quiz-related interfaces
export interface QuizRequest {
  prompt: string;
  generatedContent: string;
  questionCount?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank' | 'drag-drop' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  dragItems?: { id: string; text: string; correctOrder: number }[];
  matchPairs?: { left: string; right: string }[];
}

export interface QuizResponse {
  questions: QuizQuestion[];
  totalQuestions: number;
}

// Image analysis interfaces
export interface ImageAnalysisRequest {
  image: File;
}

export interface ImageAnalysisResponse {
  analysis: string;
  success: boolean;
  error?: string;
}