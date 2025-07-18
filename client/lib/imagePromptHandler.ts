import type { GeneratedSection } from '../types/api';

export interface ImagePromptHandlerProps {
  isImageMode: boolean;
  imageAnalysis: string | null;
  userPrompt: string;
  context?: string;
  isChained: boolean;
}

export interface ImagePromptResult {
  finalPrompt: string;
  hasImageContext: boolean;
  imageContext?: string;
}

/**
 * Handles image prompt processing and context management
 */
export class ImagePromptHandler {
  
  /**
   * Process user prompt with image context if in image mode
   */
  static processPrompt(props: ImagePromptHandlerProps): ImagePromptResult {
    const { isImageMode, imageAnalysis, userPrompt, context, isChained } = props;
    
    let finalPrompt = userPrompt;
    let hasImageContext = false;
    let imageContext = '';
    
    if (isImageMode && imageAnalysis) {
      hasImageContext = true;
      imageContext = imageAnalysis;
      finalPrompt = `[Image Context: ${imageAnalysis}] ${userPrompt}`;
    }
    
    return {
      finalPrompt,
      hasImageContext,
      imageContext
    };
  }
  
  /**
   * Generate enhanced prompt variations for image analysis
   */
  static generateImagePromptVariations(originalPrompt: string, imageAnalysis: string, isChained: boolean = false, context?: string): string[] {
    const imageContext = `[Image Context: ${imageAnalysis}]`;
    
    if (isChained && context) {
      return [
        `${imageContext} ${context} ## ${originalPrompt} - Provide a comprehensive analysis of the image with detailed explanations.`,
        `${imageContext} ${context} ### What can you observe in this image? - Describe the visual elements, objects, and details.`,
        `${imageContext} ${context} ### How does this image relate to ${originalPrompt}? - Explain the connection and relevance.`,
        `${imageContext} ${context} ### What questions can be answered about this image? - Provide insights and interpretations.`
      ];
    } else {
      return [
        `${imageContext} ## ${originalPrompt} - Provide a comprehensive analysis of the image with detailed explanations and observations.`,
        `${imageContext} ### What can you observe in this image? - Describe the visual elements, objects, text, and important details.`,
        `${imageContext} ### How does this image relate to ${originalPrompt}? - Explain the connection, relevance, and context.`,
        `${imageContext} ### What insights can be drawn from this image? - Provide analysis, interpretations, and key takeaways.`
      ];
    }
  }
  
  /**
   * Create section titles for image-based content
   */
  static generateImageSectionTitles(originalPrompt: string): string[] {
    return [
      `Image Analysis: ${originalPrompt.split(' ').slice(0, 3).join(' ')}`,
      `Visual Observations`,
      `Context and Relevance`,
      `Key Insights and Interpretations`
    ];
  }
  
  /**
   * Build contextual prompt with image analysis
   */
  static buildImageContextualPrompt(prompt: string, imageAnalysis: string, context?: string, isChained: boolean = false): string {
    const imageContext = `[Image Context: ${imageAnalysis}]`;
    
    if (isChained && context) {
      return `${imageContext} ${context} ${prompt}`;
    }
    
    return `${imageContext} ${prompt}`;
  }
  
  /**
   * Create generated sections for image-based responses
   */
  static createImageGeneratedSections(
    responses: any[], 
    originalPrompt: string, 
    imageAnalysis: string,
    chainDepth: number = 0
  ): GeneratedSection[] {
    const sectionTitles = this.generateImageSectionTitles(originalPrompt);
    
    return responses.map((response, index) => ({
      id: `image-section-${Date.now()}-${index}`,
      title: sectionTitles[index] || `Image Analysis ${index + 1}`,
      prompt: response.prompt,
      content: response.response,
      timestamp: new Date(),
      chainDepth: chainDepth,
      isChained: chainDepth > 1,
      imageUrl: '', // Will be updated when image is ready
      hasImageContext: true,
      imageAnalysis: imageAnalysis
    }));
  }
  
  /**
   * Validate image upload
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' 
      };
    }
    
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'Image file size must be less than 10MB' 
      };
    }
    
    return { isValid: true };
  }
  
  /**
   * Extract image context from prompt
   */
  static extractImageContext(prompt: string): { hasImageContext: boolean; imageContext?: string; cleanPrompt?: string } {
    const hasImageContext = prompt.includes('[Image Context:') && prompt.includes(']');
    
    if (hasImageContext) {
      const match = prompt.match(/\[Image Context: (.*?)\]/);
      if (match) {
        const imageContext = match[1];
        const cleanPrompt = prompt.replace(/\[Image Context: .*?\]/, '').trim();
        return { hasImageContext: true, imageContext, cleanPrompt };
      }
    }
    
    return { hasImageContext: false };
  }
}

export default ImagePromptHandler; 