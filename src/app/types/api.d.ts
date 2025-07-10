export interface GenerateRequest {
    prompt: string;
  }
  
  // Shape coming *out of* POST /api/generate
  export interface GenerateResponse {
    text: string;
  }
  