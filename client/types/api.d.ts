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