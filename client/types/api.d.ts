export interface GenerateRequest {
  prompt: string;
  context?: string;
  isChained?: boolean;
  generateImage?: boolean; // New field to request image generation
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
}